import os
from pymilvus import MilvusClient, DataType
from dotenv import load_dotenv

load_dotenv()

class MilvusManager:
    def __init__(self):
        self.collection_name = "document_embeddings"
        self.dimension = 1536  # OpenAI text-embedding-ada-002 dimension
        
        # Connect to Milvus using the provided credentials
        uri = os.getenv("MILVUS_HOST")
        self.client = MilvusClient(
            uri=uri,
            token=os.getenv("MILVUS_TOKEN")
        )
        
        self._create_collection()
    
    def _create_collection(self):
        """Create collection if it doesn't exist"""
        try:
            # Check if collection exists
            if self.client.has_collection(self.collection_name):
                print(f"Collection '{self.collection_name}' already exists")
                return
            
            # Create collection schema
            schema = self.client.create_schema(
                auto_id=True,
                enable_dynamic_field=True
            )
            
            # Add fields
            schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)
            schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=self.dimension)
            schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=65535)
            schema.add_field(field_name="metadata", datatype=DataType.JSON)
            
            # Create index params
            index_params = self.client.prepare_index_params()
            index_params.add_index(
                field_name="embedding",
                metric_type="COSINE",
                index_type="AUTOINDEX"
            )
            
            # Create collection
            self.client.create_collection(
                collection_name=self.collection_name,
                schema=schema,
                index_params=index_params
            )
            
            print(f"Collection '{self.collection_name}' created successfully")
            
        except Exception as e:
            print(f"Error creating collection: {e}")
    
    def insert_documents(self, embeddings, texts, metadata_list):
        """Insert documents into Milvus"""
        try:
            data = [
                {
                    "embedding": embedding,
                    "text": text,
                    "metadata": metadata
                }
                for embedding, text, metadata in zip(embeddings, texts, metadata_list)
            ]
            
            result = self.client.insert(
                collection_name=self.collection_name,
                data=data
            )
            
            print(f"Inserted {len(data)} documents")
            return result
            
        except Exception as e:
            print(f"Error inserting documents: {e}")
            raise
    
    def search(self, query_embedding, top_k=5, filter_expr=None):
        """Search for similar documents"""
        try:
            search_params = {
                "metric_type": "COSINE",
                "params": {}
            }
            
            results = self.client.search(
                collection_name=self.collection_name,
                data=[query_embedding],
                anns_field="embedding",
                search_params=search_params,
                limit=top_k,
                output_fields=["text", "metadata"],
                filter=filter_expr
            )
            
            return results[0] if results else []
            
        except Exception as e:
            print(f"Error searching documents: {e}")
            raise
    
    def delete_collection(self):
        """Delete the collection"""
        try:
            self.client.drop_collection(self.collection_name)
            print(f"Collection '{self.collection_name}' deleted")
        except Exception as e:
            print(f"Error deleting collection: {e}")
    
    def get_collection_stats(self):
        """Get collection statistics"""
        try:
            stats = self.client.describe_collection(self.collection_name)
            count = self.client.query(
                collection_name=self.collection_name,
                filter="",
                output_fields=["count(*)"]
            )
            return {
                "collection_name": self.collection_name,
                "stats": stats,
                "document_count": count[0].get("count(*)") if count else 0
            }
        except Exception as e:
            print(f"Error getting collection stats: {e}")
            return None
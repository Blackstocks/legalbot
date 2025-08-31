import os
from typing import List, Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv
from milvus_client import MilvusManager
from document_processor import DocumentProcessor
from embeddings import EmbeddingGenerator

load_dotenv()

class RAGEngine:
    def __init__(self):
        self.milvus_manager = MilvusManager()
        self.doc_processor = DocumentProcessor()
        self.embedding_generator = EmbeddingGenerator()
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.chat_model = "gpt-4-turbo"
    
    def upload_and_index_document(self, file_path: str = None, file_bytes: bytes = None, 
                                  file_type: str = None, filename: str = None) -> Dict[str, Any]:
        """Process, embed, and store document in Milvus"""
        try:
            # Process document to extract text chunks
            chunks = self.doc_processor.process_file(file_path, file_bytes, file_type)
            
            if not chunks:
                return {"success": False, "message": "No text could be extracted from the document"}
            
            # Extract texts and metadata
            texts = [chunk["text"] for chunk in chunks]
            metadata_list = [chunk["metadata"] for chunk in chunks]
            
            # Add filename to metadata if provided
            if filename:
                for metadata in metadata_list:
                    metadata["filename"] = filename
            
            # Generate embeddings
            embeddings = self.embedding_generator.generate_embeddings(texts)
            
            # Store in Milvus
            self.milvus_manager.insert_documents(embeddings, texts, metadata_list)
            
            return {
                "success": True,
                "message": f"Successfully indexed {len(chunks)} chunks from document",
                "chunks_count": len(chunks)
            }
            
        except Exception as e:
            return {"success": False, "message": f"Error processing document: {str(e)}"}
    
    def search_similar_chunks(self, query: str, top_k: int = 5, 
                              filter_conditions: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Search for similar chunks in the vector database"""
        try:
            # Generate query embedding
            query_embedding = self.embedding_generator.generate_query_embedding(query)
            
            # Build filter expression if conditions provided
            filter_expr = None
            if filter_conditions:
                # Example: {"filename": "document.pdf"}
                conditions = []
                for key, value in filter_conditions.items():
                    conditions.append(f'metadata["{key}"] == "{value}"')
                filter_expr = " and ".join(conditions)
            
            # Search in Milvus
            results = self.milvus_manager.search(query_embedding, top_k, filter_expr)
            
            # Format results
            formatted_results = []
            for hit in results:
                formatted_results.append({
                    "text": hit.get("entity", {}).get("text", ""),
                    "metadata": hit.get("entity", {}).get("metadata", {}),
                    "distance": hit.get("distance", 0),
                    "score": 1 - hit.get("distance", 0)  # Convert distance to similarity score
                })
            
            return formatted_results
            
        except Exception as e:
            print(f"Error searching documents: {e}")
            return []
    
    def chat_with_context(self, query: str, top_k: int = 5, 
                          filter_conditions: Optional[Dict] = None,
                          conversation_history: Optional[List[Dict]] = None) -> str:
        """Chat with documents using RAG"""
        try:
            # Search for relevant chunks
            relevant_chunks = self.search_similar_chunks(query, top_k, filter_conditions)
            
            if not relevant_chunks:
                return "I couldn't find any relevant information in the uploaded documents. Please make sure you've uploaded documents first."
            
            # Build context from relevant chunks
            context = "\n\n".join([
                f"[Source: {chunk['metadata'].get('filename', 'Unknown')} - "
                f"Chunk {chunk['metadata'].get('chunk_index', 'Unknown')}]\n{chunk['text']}"
                for chunk in relevant_chunks
            ])
            
            # Build messages for chat
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that answers questions based on the provided context. "
                        "Always cite the source of your information when answering. "
                        "If the context doesn't contain relevant information, say so clearly."
                    )
                }
            ]
            
            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current query with context
            messages.append({
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {query}"
            })
            
            # Generate response
            response = self.openai_client.chat.completions.create(
                model=self.chat_model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Error generating response: {str(e)}"
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector database"""
        return self.milvus_manager.get_collection_stats()
    
    def clear_all_documents(self):
        """Clear all documents from the database"""
        try:
            self.milvus_manager.delete_collection()
            self.milvus_manager = MilvusManager()  # Recreate collection
            return {"success": True, "message": "All documents cleared successfully"}
        except Exception as e:
            return {"success": False, "message": f"Error clearing documents: {str(e)}"}
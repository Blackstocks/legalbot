import os
from typing import List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class EmbeddingGenerator:
    def __init__(self, model: str = "text-embedding-ada-002"):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = model
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        try:
            # Remove empty texts
            texts = [text for text in texts if text.strip()]
            
            if not texts:
                return []
            
            # Generate embeddings in batches if needed
            embeddings = []
            batch_size = 100  # OpenAI recommends max 2048 for ada-002
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                
                response = self.client.embeddings.create(
                    input=batch,
                    model=self.model
                )
                
                batch_embeddings = [item.embedding for item in response.data]
                embeddings.extend(batch_embeddings)
            
            return embeddings
            
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            raise
    
    def generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for a single query"""
        try:
            response = self.client.embeddings.create(
                input=query,
                model=self.model
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            print(f"Error generating query embedding: {e}")
            raise
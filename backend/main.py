import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import tempfile
import shutil
from rag_engine import RAGEngine

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_count: int

# Initialize RAG engine
rag_engine = RAGEngine()

# Store conversation history per session (in production, use Redis or similar)
conversation_history = []

@app.post("/v1/api/uploadfile", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Check file size (1MB = 1024 * 1024 bytes)
        MAX_FILE_SIZE = 1 * 1024 * 1024  # 1MB in bytes
        
        # Read file content
        file_content = await file.read()
        
        # Check if file size exceeds limit
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413, 
                detail=f"File size exceeds maximum allowed size of 1MB. Your file is {len(file_content) / (1024 * 1024):.2f}MB"
            )
        
        file_extension = file.filename.split('.')[-1].lower()
        
        # Process and index the document using RAG engine
        result = rag_engine.upload_and_index_document(
            file_bytes=file_content,
            file_type=file_extension,
            filename=file.filename
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        
        return UploadResponse(
            message=result["message"],
            filename=file.filename,
            chunks_count=result.get("chunks_count", 0)
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {e}")


@app.post("/v1/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global conversation_history
    try:
        # Add user message to history
        conversation_history.append({"role": "user", "content": request.message})
        
        # Get response from RAG engine
        response = rag_engine.chat_with_context(
            query=request.message,
            top_k=5,
            conversation_history=conversation_history[:-1]  # Exclude current message
        )
        
        # Add assistant response to history
        conversation_history.append({"role": "assistant", "content": response})
        
        # Keep only last 10 messages to prevent context overflow
        if len(conversation_history) > 10:
            conversation_history = conversation_history[-10:]
        
        return ChatResponse(reply=response)
        
    except Exception as e:
        print(f"Error processing chat request: {e}")
        return ChatResponse(reply="Sorry, I am currently unable to process your request. Please try again later.")

@app.get("/v1/api/stats")
async def get_stats():
    """Get statistics about the document database"""
    try:
        stats = rag_engine.get_stats()
        return stats
    except Exception as e:
        return {"error": str(e)}

@app.delete("/v1/api/clear")
async def clear_documents():
    """Clear all documents from the database"""
    global conversation_history
    try:
        result = rag_engine.clear_all_documents()
        conversation_history = []  # Reset conversation history
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1")
def read_root():
    return {"message": "Backend is running with Milvus RAG"}
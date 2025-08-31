from fastapi import APIRouter, UploadFile, File, HTTPException
from app.api.v1.models.chat import ChatRequest, ChatResponse, UploadResponse
from app.features.chat_pdf.rag_engine import RAGEngine
from app.core.config import settings

router = APIRouter()

# Initialize RAG engine
rag_engine = RAGEngine()

# Store conversation history per session (in production, use Redis or similar)
conversation_history = []

@router.post("/uploadfile", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Check file size from settings
        MAX_FILE_SIZE = settings.MAX_FILE_SIZE
        
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


@router.post("/chat", response_model=ChatResponse)
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
        
        # Keep only last N messages to prevent context overflow
        if len(conversation_history) > settings.MAX_CONVERSATION_HISTORY:
            conversation_history = conversation_history[-settings.MAX_CONVERSATION_HISTORY:]
        
        return ChatResponse(reply=response)
        
    except Exception as e:
        print(f"Error processing chat request: {e}")
        return ChatResponse(reply="Sorry, I am currently unable to process your request. Please try again later.")

@router.get("/stats")
async def get_stats():
    """Get statistics about the document database"""
    try:
        stats = rag_engine.get_stats()
        return stats
    except Exception as e:
        return {"error": str(e)}

@router.delete("/clear")
async def clear_documents():
    """Clear all documents from the database"""
    global conversation_history
    try:
        result = rag_engine.clear_all_documents()
        conversation_history = []  # Reset conversation history
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
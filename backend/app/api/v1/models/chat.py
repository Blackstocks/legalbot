from pydantic import BaseModel
from typing import Optional, List, Dict

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_count: int
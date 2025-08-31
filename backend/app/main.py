import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import chat_pdf

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="LegalBot API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(
    chat_pdf.router,
    prefix="/v1/api",
    tags=["chat-pdf"]
)

@app.get("/v1")
def read_root():
    return {"message": "LegalBot Backend API v1.0.0", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
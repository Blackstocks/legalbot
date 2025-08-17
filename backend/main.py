import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from PIL import Image
import pytesseract
import io
import tempfile
import shutil

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

# Global variable to store the active vector store
# In a production environment, you would manage this more robustly (e.g., per session, persistent storage)
active_vectorstore = None

# Initialize OpenAI LLM
llm = ChatOpenAI(model="gpt-3.5-turbo", api_key=os.getenv("OPENAI_API_KEY"))

# Initialize embeddings model
# Using a local sentence-transformers model for free embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

@app.post("/api/uploadfile")
async def upload_file(file: UploadFile = File(...)):
    global active_vectorstore
    try:
        # Create a temporary file to save the uploaded content
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name

        documents = []
        file_extension = file.filename.split('.')[-1].lower()

        if file_extension == "pdf":
            loader = PyPDFLoader(tmp_file_path)
            documents = loader.load()
        elif file_extension == "docx":
            loader = Docx2txtLoader(tmp_file_path)
            documents = loader.load()
        elif file_extension in ["png", "jpg", "jpeg", "tiff", "bmp", "gif"]:
            # OCR for images
            # IMPORTANT: pytesseract requires Tesseract-OCR to be installed on your system.
            # See https://tesseract-ocr.github.io/tessdoc/Installation.html
            try:
                image = Image.open(tmp_file_path)
                text = pytesseract.image_to_string(image)
                if text:
                    documents.append({"page_content": text, "metadata": {"source": file.filename, "page": 1}})
                else:
                    raise ValueError("No text found in image via OCR.")
            except Exception as e:
                os.unlink(tmp_file_path) # Clean up temp file
                raise HTTPException(status_code=400, detail=f"OCR failed for image: {e}. Ensure Tesseract-OCR is installed and configured correctly.")
        else:
            os.unlink(tmp_file_path) # Clean up temp file
            raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF, DOCX, and common image formats are supported.")

        os.unlink(tmp_file_path) # Clean up the temporary file

        if not documents:
            raise HTTPException(status_code=400, detail="Could not load any content from the document.")

        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)

        # Create a new Chroma vector store from the chunks
        # This will create an in-memory vector store for now.
        # For persistence, you would specify a persist_directory.
        active_vectorstore = Chroma.from_documents(chunks, embeddings)

        return {"message": "File processed and RAG model updated successfully", "filename": file.filename}
    except HTTPException as e:
        raise e # Re-raise FastAPI HTTPExceptions
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {e}")


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global active_vectorstore
    try:
        if active_vectorstore is None:
            # If no document is uploaded, use the basic LLM chain
            system_prompt = "You are a helpful legal assistant named Legalbot. Provide concise and accurate legal information. If you don't know the answer, state that you are not equipped to provide that specific legal advice."
            prompt_template = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("user", "{message}")
            ])
            basic_chain = prompt_template | llm | StrOutputParser()
            response = basic_chain.invoke({"message": request.message})
            return ChatResponse(reply=response)
        else:
            # Use the RAG chain if a document is active
            retriever = active_vectorstore.as_retriever()

            # Define the prompt for the RAG chain
            rag_prompt = ChatPromptTemplate.from_template("""Answer the user's question based on the provided context.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.

            Context: {context}
            Question: {input}""")

            # Create the document combining chain
            document_chain = create_stuff_documents_chain(llm, rag_prompt)

            # Create the retrieval chain
            retrieval_chain = create_retrieval_chain(retriever, document_chain)

            # Invoke the RAG chain
            response = retrieval_chain.invoke({"input": request.message})
            # The response from create_retrieval_chain is a dictionary,
            # the actual answer is in the "answer" key.
            return ChatResponse(reply=response["answer"])

    except Exception as e:
        print(f"Error processing chat request: {e}")
        return ChatResponse(reply="Sorry, I am currently unable to process your request. Please try again later.")

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
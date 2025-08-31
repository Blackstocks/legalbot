import os
import io
import base64
from typing import List, Dict, Any
from PIL import Image
import PyPDF2
import pytesseract
from pdf2image import convert_from_path, convert_from_bytes
import tempfile

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def process_pdf(self, file_path: str = None, file_bytes: bytes = None) -> List[Dict[str, Any]]:
        """Extract text from PDF and split into chunks"""
        chunks = []
        
        try:
            if file_path:
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    total_pages = len(pdf_reader.pages)
                    
                    full_text = ""
                    for page_num in range(total_pages):
                        page = pdf_reader.pages[page_num]
                        text = page.extract_text()
                        full_text += text + "\n"
                    
                    # If text extraction fails, try OCR
                    if not full_text.strip():
                        full_text = self._ocr_pdf(file_path=file_path)
            
            elif file_bytes:
                pdf_file = io.BytesIO(file_bytes)
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                total_pages = len(pdf_reader.pages)
                
                full_text = ""
                for page_num in range(total_pages):
                    page = pdf_reader.pages[page_num]
                    text = page.extract_text()
                    full_text += text + "\n"
                
                # If text extraction fails, try OCR
                if not full_text.strip():
                    full_text = self._ocr_pdf(file_bytes=file_bytes)
            
            # Split text into chunks
            chunks = self._split_text(full_text)
            
            # Add metadata to each chunk
            for i, chunk in enumerate(chunks):
                chunks[i] = {
                    "text": chunk,
                    "metadata": {
                        "source": file_path if file_path else "uploaded_pdf",
                        "type": "pdf",
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    }
                }
            
        except Exception as e:
            print(f"Error processing PDF: {e}")
            raise
        
        return chunks
    
    def _ocr_pdf(self, file_path: str = None, file_bytes: bytes = None) -> str:
        """Use OCR to extract text from PDF"""
        try:
            if file_path:
                images = convert_from_path(file_path)
            else:
                images = convert_from_bytes(file_bytes)
            
            full_text = ""
            for i, image in enumerate(images):
                text = pytesseract.image_to_string(image)
                full_text += f"\n--- Page {i+1} ---\n{text}"
            
            return full_text
        
        except Exception as e:
            print(f"Error in OCR: {e}")
            return ""
    
    def process_image(self, file_path: str = None, file_bytes: bytes = None) -> List[Dict[str, Any]]:
        """Extract text from image using OCR"""
        try:
            if file_path:
                image = Image.open(file_path)
            else:
                image = Image.open(io.BytesIO(file_bytes))
            
            # Extract text using OCR
            text = pytesseract.image_to_string(image)
            
            # Split text into chunks if needed
            chunks = self._split_text(text)
            
            # Add metadata to each chunk
            result = []
            for i, chunk in enumerate(chunks):
                result.append({
                    "text": chunk,
                    "metadata": {
                        "source": file_path if file_path else "uploaded_image",
                        "type": "image",
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    }
                })
            
            return result
            
        except Exception as e:
            print(f"Error processing image: {e}")
            raise
    
    def _split_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        if not text.strip():
            return []
        
        # Clean text
        text = text.replace('\n\n', ' ').replace('\n', ' ').strip()
        
        # If text is shorter than chunk size, return as is
        if len(text) <= self.chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            # Find the end of the chunk
            end = start + self.chunk_size
            
            # If this is not the last chunk, try to break at a sentence or word boundary
            if end < len(text):
                # Try to find a sentence boundary
                for sep in ['. ', '? ', '! ', '\n']:
                    last_sep = text.rfind(sep, start, end)
                    if last_sep != -1:
                        end = last_sep + len(sep)
                        break
                else:
                    # If no sentence boundary, try word boundary
                    last_space = text.rfind(' ', start, end)
                    if last_space != -1:
                        end = last_space + 1
            
            chunks.append(text[start:end].strip())
            
            # Move start position with overlap
            start = end - self.chunk_overlap
        
        return chunks
    
    def process_file(self, file_path: str = None, file_bytes: bytes = None, 
                     file_type: str = None) -> List[Dict[str, Any]]:
        """Process file based on type"""
        if file_path:
            _, ext = os.path.splitext(file_path.lower())
            file_type = ext[1:] if ext else file_type
        
        if file_type in ['pdf']:
            return self.process_pdf(file_path, file_bytes)
        elif file_type in ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff']:
            return self.process_image(file_path, file_bytes)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
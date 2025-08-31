# LegalBot Backend

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── models/       # Pydantic models for request/response
│   │       └── routes/       # API endpoints
│   ├── core/                 # Core functionality
│   │   ├── config.py        # Configuration settings
│   │   ├── embeddings.py    # Embedding generation
│   │   └── milvus_client.py # Vector database client
│   ├── features/            # Feature-specific modules
│   │   ├── chat_pdf/        # PDF chat functionality
│   │   ├── document_analysis/
│   │   ├── legal_research/
│   │   └── contract_review/
│   ├── models/              # Database models
│   ├── utils/               # Utility functions
│   └── main.py             # FastAPI application
├── main.py                  # Entry point (for backward compatibility)
├── requirements.txt
└── .env
```

## API Endpoints

All endpoints are prefixed with `/v1/api`

### Chat with PDF
- `POST /v1/api/uploadfile` - Upload a PDF document
- `POST /v1/api/chat` - Chat with uploaded documents
- `GET /v1/api/stats` - Get document database statistics
- `DELETE /v1/api/clear` - Clear all documents

### Health Check
- `GET /health` - Check API health status
- `GET /v1` - Get API information

## Running the Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# or
uvicorn app.main:app --reload --port 8000
```

## Environment Variables

Create a `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key
MILVUS_HOST=localhost
MILVUS_PORT=19530
```

## Adding New Features

1. Create a new folder under `app/features/`
2. Add your feature logic there
3. Create routes in `app/api/v1/routes/`
4. Include the router in `app/main.py`
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEXTS_DIRECTORY = PROJECT_ROOT / "data" / "text_files"
KNOWLEDGE_DIRECTORY = PROJECT_ROOT / "data" / "knowledge_base"
RESUME_FILE = PROJECT_ROOT / "src" / "resume" / "Aman_Chauhan_Resume.pdf"
VECTOR_STORE_DIRECTORY = PROJECT_ROOT / "data" / "vector_store"

EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "aman_portfolio_knowledge")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-3.6-flash")

API_HOST = os.getenv("HOST", "127.0.0.1")
API_PORT = int(os.getenv("PORT", "8000"))


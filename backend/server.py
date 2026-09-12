"""FastAPI Backend Server for Aman Singh Chauhan's Portfolio RAG Assistant."""

import os
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel, Field

from src.config import API_HOST, API_PORT, GEMINI_MODEL_NAME
from src.ingest import initialize_rag_system
from src.pipeline import rag_advanced
from src.retriever import RAGRetriever
from src.vector_store import VectorStore

# Load environment variables
load_dotenv()

# Global pipeline references
retriever_instance: Optional[RAGRetriever] = None
vector_store_instance: Optional[VectorStore] = None
gemini_client: Optional[genai.Client] = None


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """Lifecycle hook: initialize ChromaDB and Gemini client on startup."""
#     global retriever_instance, vector_store_instance, gemini_client
#     print("Initializing Portfolio RAG System...")

#     # 1. Initialize persistent vector store and retriever
#     retriever_instance, vector_store_instance, _ = initialize_rag_system(force_reindex=False)

#     # 2. Initialize Gemini API Client if key is provided
#     api_key = os.getenv("GEMINI_API_KEY")
#     if api_key:
#         try:
#             if gemini_client is not None and hasattr(gemini_client, "close"):
#                 gemini_client.close()
#             gemini_client = genai.Client(api_key=api_key)
#             print(f"Gemini Client connected successfully (Model: {GEMINI_MODEL_NAME}).")
#         except Exception as err:
#             print(f"Failed to initialize Gemini Client: {err}")
#             gemini_client = None
#     else:
#         print("GEMINI_API_KEY is not set. The server will return grounded excerpts from ChromaDB.")

#     yield

#     print("Shutting down Portfolio RAG server.")
#     if gemini_client is not None and hasattr(gemini_client, "close"):
#         try:
#             gemini_client.close()
#         except Exception as err:
#             print(f"Failed to close Gemini Client cleanly: {err}")
#         finally:
#             gemini_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 SERVER STARTING", flush=True)
    yield
    print("🛑 SERVER STOPPING", flush=True)
    
app = FastAPI(
    title="Aman Singh Chauhan — Portfolio AI Assistant API",
    description="RAG-powered conversational API answering queries about Aman's profile, projects, and skills.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user question or message.")
    history: Optional[List[Dict[str, str]]] = Field(
        default=None, description="Previous messages in format [{'role': 'user'|'assistant', 'content': '...'}]"
    )


class ChatSource(BaseModel):
    source: str
    category: str
    score: float
    preview: str


class ChatResponse(BaseModel):
    reply: str
    sources: List[ChatSource]
    confidence: float
    suggestions: List[str]


@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    """Check health and status of vector store and LLM integration."""
    return {
        "status": "healthy",
        "vector_store_chunks": vector_store_instance.count() if vector_store_instance else 0,
        "gemini_connected": gemini_client is not None,
        "gemini_model": GEMINI_MODEL_NAME,
        "collection_name": vector_store_instance.collection_name if vector_store_instance else "",
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    """Ask a question about Aman Singh Chauhan's background, projects, skills, or resume."""
    if not retriever_instance:
        raise HTTPException(status_code=503, detail="RAG system not initialized yet.")

    query = payload.message.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    result = rag_advanced(
        query=query,
        retriever=retriever_instance,
        llm=gemini_client,
        top_k=4,
        min_score=0.15,
        history=payload.history,
    )

    return ChatResponse(
        reply=result["answer"],
        sources=[ChatSource(**s) for s in result["sources"]],
        confidence=result["confidence"],
        suggestions=result.get("suggestions", []),
    )


@app.post("/api/reindex")
def reindex_endpoint() -> Dict[str, Any]:
    """Force re-ingest all knowledge documents and resume into ChromaDB."""
    global retriever_instance, vector_store_instance
    print("Reindexing requested via API...")
    retriever_instance, vector_store_instance, _ = initialize_rag_system(force_reindex=True)
    return {
        "status": "reindexed",
        "vector_store_chunks": vector_store_instance.count() if vector_store_instance else 0,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host=API_HOST, port=API_PORT, reload=False)

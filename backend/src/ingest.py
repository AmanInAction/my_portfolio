"""Document ingestion and indexing pipeline for Aman Singh Chauhan's portfolio RAG."""

import sys
from typing import Tuple

from .chunking import split_documents
from .embeddings import EmbeddingManager
from .loaders import load_all_portfolio_documents
from .retriever import RAGRetriever
from .vector_store import VectorStore


def initialize_rag_system(force_reindex: bool = False) -> Tuple[RAGRetriever, VectorStore, EmbeddingManager]:
    """
    Initialize the persistent vector store and retriever.
    If chunks already exist in the persistent ChromaDB store and force_reindex is False,
    it reuses the existing embeddings immediately without re-embedding.
    """
    embedding_manager = EmbeddingManager()
    vector_store = VectorStore()

    existing_count = vector_store.count()
    if existing_count > 0 and not force_reindex:
        print(f"Persistent vector store already populated with {existing_count} chunks. Ready for retrieval!")
        retriever = RAGRetriever(vector_store, embedding_manager)
        return retriever, vector_store, embedding_manager

    if force_reindex and existing_count > 0:
        print("Force reindex requested. Clearing existing collection...")
        vector_store.reset()

    print("Ingesting portfolio knowledge base and resume into vector store...")
    documents = load_all_portfolio_documents()
    if not documents:
        print("Warning: No documents found to index.")
        retriever = RAGRetriever(vector_store, embedding_manager)
        return retriever, vector_store, embedding_manager

    chunks = split_documents(documents, chunk_size=700, chunk_overlap=120)
    print(f"Generated {len(chunks)} chunks from {len(documents)} source documents.")

    print("Computing embeddings...")
    embeddings = embedding_manager.generate_embeddings(chunks)

    print("Storing embeddings in persistent ChromaDB...")
    vector_store.add_documents(chunks, embeddings)

    print(f"Ingestion complete! Total chunks indexed: {vector_store.count()}")
    retriever = RAGRetriever(vector_store, embedding_manager)
    return retriever, vector_store, embedding_manager


if __name__ == "__main__":
    force = "--force" in sys.argv or "-f" in sys.argv or "--reindex" in sys.argv
    initialize_rag_system(force_reindex=force)

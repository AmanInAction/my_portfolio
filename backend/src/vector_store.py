import hashlib
from pathlib import Path
from typing import Any, Dict, List

import chromadb
import numpy as np
from chromadb.config import Settings
from langchain_core.documents import Document

from .config import COLLECTION_NAME, VECTOR_STORE_DIRECTORY


class VectorStore:
    """Persistent Chroma collection for document chunks and embeddings."""

    def __init__(
        self,
        collection_name: str = COLLECTION_NAME,
        persist_directory: Path = VECTOR_STORE_DIRECTORY,
    ) -> None:
        self.collection_name = collection_name
        self.persist_directory = Path(persist_directory)
        self.persist_directory.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=str(self.persist_directory),
            settings=Settings(allow_reset=True),
        )
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={
                "description": "Collection of portfolio document embeddings for Aman Singh Chauhan",
                "hnsw:space": "cosine",
            },
        )
        print(
            f"ChromaDB collection '{collection_name}' initialized at {self.persist_directory}. "
            f"Stored chunks: {self.collection.count()}"
        )

    def count(self) -> int:
        """Return the number of stored document chunks."""
        return self.collection.count()

    def reset(self) -> None:
        """Clear and recreate the collection."""
        self.client.delete_collection(name=self.collection_name)
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={
                "description": "Collection of portfolio document embeddings for Aman Singh Chauhan",
                "hnsw:space": "cosine",
            },
        )
        print(f"Collection '{self.collection_name}' reset.")

    def add_documents(self, documents: List[Document], embeddings: np.ndarray) -> None:
        """Add or update document chunks with their embeddings idempotently."""
        if len(documents) != embeddings.shape[0]:
            raise ValueError("Number of documents and embeddings must match.")
        if not documents:
            print("No documents to add.")
            return

        ids: List[str] = []
        metadatas: List[Dict[str, Any]] = []
        document_texts: List[str] = []
        embedding_values: List[List[float]] = []

        for index, (document, embedding) in enumerate(zip(documents, embeddings)):
            # Generate deterministic ID based on content hash and source
            content_hash = hashlib.sha256(document.page_content.encode("utf-8")).hexdigest()[:12]
            source_file = document.metadata.get("source_file", "doc").replace(" ", "_")
            doc_id = f"{source_file}_{index}_{content_hash}"
            ids.append(doc_id)

            # Chroma metadata sanitization: values must be str, int, float, bool
            clean_metadata: Dict[str, Any] = {}
            for k, v in document.metadata.items():
                if v is None:
                    continue
                if isinstance(v, (str, int, float, bool)):
                    clean_metadata[k] = v
                else:
                    clean_metadata[k] = str(v)

            clean_metadata["chunk_index"] = index
            clean_metadata["content_length"] = len(document.page_content)
            metadatas.append(clean_metadata)

            document_texts.append(document.page_content)
            embedding_values.append(embedding.tolist())

        # Use upsert to prevent duplicates while allowing updates
        self.collection.upsert(
            ids=ids,
            embeddings=embedding_values,
            metadatas=metadatas,
            documents=document_texts,
        )
        print(f"Successfully upserted {len(documents)} chunks to '{self.collection_name}'. Total: {self.collection.count()}")


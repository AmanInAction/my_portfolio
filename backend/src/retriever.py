from typing import Any, Dict, List

from .embeddings import EmbeddingManager
from .vector_store import VectorStore


class RAGRetriever:
    """Retrieve the most similar chunks from a vector store."""

    def __init__(self, vector_store: VectorStore, embedding_manager: EmbeddingManager) -> None:
        self.vector_store = vector_store
        self.embedding_manager = embedding_manager

    def retrieval(
        self,
        query: str,
        top_k: int = 5,
        score_threshold: float = 0.0,
    ) -> List[Dict[str, Any]]:
        collection_size = self.vector_store.count()
        if collection_size == 0:
            return []

        # Ensure n_results does not exceed total items in collection
        actual_k = min(top_k, collection_size)
        query_embedding = self.embedding_manager.generate_embeddings([query])[0]
        results = self.vector_store.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=actual_k,
        )

        retrieved_docs = []
        documents = (results.get("documents") or [[]])[0]
        metadatas = (results.get("metadatas") or [[]])[0]
        distances = (results.get("distances") or [[]])[0]
        ids = (results.get("ids") or [[]])[0]

        for rank, (doc_id, document, metadata, distance) in enumerate(
            zip(ids, documents, metadatas, distances), start=1
        ):
            # Chroma with cosine distance: distance is in [0, 2], similarity is 1 - distance
            similarity_score = round(max(0.0, min(1.0, 1.0 - float(distance))), 4)
            if similarity_score >= score_threshold:
                retrieved_docs.append(
                    {
                        "id": doc_id,
                        "content": document,
                        "metadata": metadata or {},
                        "similarity_score": similarity_score,
                        "distance": distance,
                        "rank": rank,
                    }
                )
        return retrieved_docs

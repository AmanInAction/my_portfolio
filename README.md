# Aman Singh Chauhan - Portfolio

Personal portfolio built with a Next.js frontend and a FastAPI backend. The site includes project and skills sections, contact information, and an AI assistant that answers questions about the portfolio using a retrieval-augmented generation (RAG) pipeline.

## Features

- Responsive portfolio UI built with Next.js, React, TypeScript, and Tailwind CSS.
- FastAPI endpoints for health checks, chat, and knowledge-base reindexing.
- ChromaDB persistent vector storage with Sentence Transformers embeddings.
- Gemini-powered answers grounded in the portfolio knowledge base and resume.
- Source previews and confidence information returned with AI responses.

## Project Structure

```text
portfolio/
├── backend/
│   ├── main.py                    # Local pipeline smoke test
│   ├── server.py                  # FastAPI application
│   ├── pyproject.toml             # Python project metadata and dependencies
│   ├── requirements.txt           # Alternative pip requirements file
│   ├── data/
│   │   ├── knowledge_base/        # Markdown documents indexed by the RAG system
│   │   └── vector_store/          # Generated ChromaDB files (ignored by Git)
│   └── src/
│       ├── chunking.py            # Document splitting
│       ├── config.py              # Paths and environment-backed settings
│       ├── embeddings.py          # Embedding generation
│       ├── ingest.py              # Index creation and reindexing
│       ├── loaders.py             # Markdown, text, and PDF loaders
│       ├── pipeline.py            # RAG response generation
│       ├── retriever.py           # Similarity retrieval
│       ├── vector_store.py        # ChromaDB integration
│       └── resume/                # Resume source document
├── frontend/
│   ├── public/                    # Static frontend assets
│   └── src/
│       ├── app/                   # App Router entry points and global styles
│       ├── components/            # Portfolio sections and UI components
│       └── lib/                   # Shared frontend utilities
├── .gitignore
└── README.md
```

## Requirements

- Node.js 20 or newer
- Python 3.13 or newer
- A Gemini API key for generated AI answers

## API Endpoints

| Method | Endpoint       | Purpose                                     |
| ------ | -------------- | ------------------------------------------- |
| `GET`  | `/api/health`  | Check vector-store and Gemini status        |
| `POST` | `/api/chat`    | Ask a grounded question about the portfolio |
| `POST` | `/api/reindex` | Rebuild the local knowledge index           |

Example chat request:

```json
{
  "message": "What projects has Aman built?",
  "history": []
}
```

## Git Hygiene

The repository ignores dependencies, virtual environments, environment files, Next.js build output, Python caches, and the generated ChromaDB vector store. Source files in `frontend/public`, the Markdown knowledge base, and the resume remain available to commit because they are required by the application.

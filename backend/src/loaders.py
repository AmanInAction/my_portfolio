from pathlib import Path
from typing import List

from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader, TextLoader
from langchain_core.documents import Document

from .config import KNOWLEDGE_DIRECTORY, RESUME_FILE, TEXTS_DIRECTORY


def create_sample_texts(output_directory: Path) -> None:
    """Create the sample input used by the original notebook."""
    output_directory.mkdir(parents=True, exist_ok=True)
    (output_directory / "sample1.txt").write_text(
        "This is the content of sample text file 1.",
        encoding="utf-8",
    )


def load_text_file(file_path: Path) -> List[Document]:
    """Load one UTF-8 text file."""
    return TextLoader(str(file_path), encoding="utf-8").load()


def load_text_directory(directory: Path) -> List[Document]:
    """Load all UTF-8 text files below a directory."""
    if not directory.exists():
        return []
    loader = DirectoryLoader(
        str(directory),
        glob="**/*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=False,
    )
    return loader.load()


def load_markdown_directory(directory: Path) -> List[Document]:
    """Load all UTF-8 markdown files below a directory with metadata."""
    if not directory.exists():
        return []
    loader = DirectoryLoader(
        str(directory),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=False,
    )
    docs = loader.load()
    for doc in docs:
        filename = Path(doc.metadata.get("source", "")).name
        category = filename.replace(".md", "").split("_", 1)[-1].replace("_", " ").title()
        doc.metadata["source_file"] = filename
        doc.metadata["category"] = category
        doc.metadata["doc_type"] = "knowledge_base"
    return docs


def load_pdf_file(file_path: Path) -> List[Document]:
    """Load a single PDF document."""
    if not file_path.exists():
        return []
    loader = PyPDFLoader(str(file_path))
    docs = loader.load()
    for doc in docs:
        doc.metadata["source_file"] = file_path.name
        doc.metadata["category"] = "Resume"
        doc.metadata["doc_type"] = "resume"
    return docs


def load_all_portfolio_documents() -> List[Document]:
    """Load all profile documents and resume for RAG ingestion."""
    all_docs: List[Document] = []

    # 1. Load markdown knowledge base
    if KNOWLEDGE_DIRECTORY.exists():
        kb_docs = load_markdown_directory(KNOWLEDGE_DIRECTORY)
        all_docs.extend(kb_docs)

    # 2. Load PDF resume
    if RESUME_FILE.exists():
        resume_docs = load_pdf_file(RESUME_FILE)
        all_docs.extend(resume_docs)

    # 3. Load text files if any exist
    if TEXTS_DIRECTORY.exists():
        txt_docs = load_text_directory(TEXTS_DIRECTORY)
        all_docs.extend(txt_docs)

    print(f"Loaded {len(all_docs)} raw documents from portfolio knowledge base and resume.")
    return all_docs


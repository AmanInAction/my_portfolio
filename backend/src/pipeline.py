from typing import Any, Dict, List

from .config import GEMINI_MODEL_NAME
from .retriever import RAGRetriever

FALLBACK_ANSWER = (
    "I couldn't find specific details regarding that in Aman's verified profile documents. "
    "Feel free to connect directly with Aman at amanchauhan10a@gmail.com or via LinkedIn at "
    "https://www.linkedin.com/in/aman-chauhan-2489b1312/!"
)


def _build_system_prompt() -> str:
    return """You are the personal AI Assistant / Copilot for Aman Singh Chauhan's software engineering portfolio.
Your mission is to represent Aman professionally, accurately, enthusiastically, and concisely.

Guidelines:
1. Always base your answers on the provided context excerpts from Aman's resume and knowledge documents.
2. Highlight specific metrics, tech stacks, and details when relevant (e.g. 6.3M transactions, 99.96% accuracy, LeetCode 50 Days Badge & 250+ problems, CGPA 8.20).
3. Be direct, articulate, and format with clean markdown (bullet points, bold highlights, concise code/stack tags).
4. If the question is outside the scope of Aman's profile, background, or projects, politely state so and suggest reaching out to Aman directly at amanchauhan10a@gmail.com.
5. Keep answers engaging, crisp, and under 3-4 paragraphs unless an in-depth breakdown is explicitly requested.
"""


def _build_rag_prompt(context: str, query: str, conversation_history: List[Dict[str, str]] | None = None) -> str:
    history_text = ""
    if conversation_history:
        recent_history = conversation_history[-4:]
        history_formatted = "\n".join(
            f"{msg.get('role', 'user').capitalize()}: {msg.get('content', '')}"
            for msg in recent_history
        )
        history_text = f"\nRecent Conversation History:\n{history_formatted}\n"

    return f"""{_build_system_prompt()}
{history_text}
Context from Aman's Verified Portfolio & Resume:
{context}

Question:
{query}

Answer:"""


def _generate_suggested_questions(query: str, results: List[Dict[str, Any]]) -> List[str]:
    """Provide context-aware follow-up question suggestions."""
    q_lower = query.lower()
    if any(k in q_lower for k in ["project", "wanderlust", "facelink", "hatchhub"]):
        return [
            "Tell me about the Wanderlust tech stack",
            "How does FaceLink use WebRTC?",
            "What was his ML internship at Placemantra?",
        ]
    elif any(k in q_lower for k in ["skill", "stack", "tech", "react", "python"]):
        return [
            "What projects showcase his full-stack skills?",
            "What are his LeetCode achievements?",
            "How can I contact Aman for an interview?",
        ]
    elif any(k in q_lower for k in ["intern", "work", "experience", "placemantra", "fraud"]):
        return [
            "What machine learning model did he build at Placemantra?",
            "What are his core backend engineering skills?",
            "Where did he go to college?",
        ]
    elif any(k in q_lower for k in ["contact", "hire", "email", "phone", "reach"]):
        return [
            "What roles is Aman currently looking for?",
            "Tell me about his key projects",
            "What are his primary programming languages?",
        ]
    else:
        return [
            "What are Aman's core technical skills?",
            "Tell me about his featured projects",
            "What did he do at Placemantra?",
        ]


def _call_gemini_client(client: Any, prompt: str) -> str:
    """Safely call Gemini using the google-genai Client."""
    # 1. Try standard client.models.generate_content
    if hasattr(client, "models") and hasattr(client.models, "generate_content"):
        response = client.models.generate_content(
            model=GEMINI_MODEL_NAME,
            contents=prompt,
        )
        if hasattr(response, "text") and response.text:
            return response.text
        if hasattr(response, "output_text") and response.output_text:
            return response.output_text

    # 2. Try client.interactions.create (fallback)
    if hasattr(client, "interactions") and hasattr(client.interactions, "create"):
        response = client.interactions.create(
            model=GEMINI_MODEL_NAME,
            input=prompt,
        )
        if hasattr(response, "output_text") and response.output_text:
            return response.output_text
        if hasattr(response, "text") and response.text:
            return response.text

    raise RuntimeError("Unsupported genai client interface or empty response.")


def rag_advanced(
    query: str,
    retriever: RAGRetriever,
    llm: Any = None,
    top_k: int = 4,
    min_score: float = 0.15,
    return_context: bool = False,
    history: List[Dict[str, str]] | None = None,
) -> Dict[str, Any]:
    """
    Execute retrieval over the persistent vector store, assemble context,
    and generate an answer grounded in Aman's profile.
    """
    results = retriever.retrieval(query, top_k=top_k, score_threshold=min_score)

    if not results:
        return {
            "answer": FALLBACK_ANSWER,
            "sources": [],
            "confidence": 0.0,
            "context": "",
            "suggestions": [
                "What are Aman's core technical skills?",
                "Tell me about his projects",
                "How do I contact Aman?",
            ],
        }

    context_blocks = []
    sources = []
    for item in results:
        meta = item["metadata"]
        category = meta.get("category", meta.get("doc_type", "Profile"))
        source_file = meta.get("source_file", "Resume / Portfolio")
        context_blocks.append(f"[{category} - {source_file}]:\n{item['content']}")

        sources.append(
            {
                "source": source_file,
                "category": category,
                "score": item["similarity_score"],
                "preview": item["content"][:180] + "...",
            }
        )

    context = "\n\n".join(context_blocks)
    confidence = max(item["similarity_score"] for item in results)
    suggestions = _generate_suggested_questions(query, results)

    # If LLM client is available, generate grounded response
    if llm:
        try:
            prompt = _build_rag_prompt(context, query, history)
            answer_text = _call_gemini_client(llm, prompt)
        except Exception as err:
            print(f"Error calling Gemini: {err}")
            # Graceful grounded fallback using retrieved context
            answer_text = (
                f"**Retrieved from Aman's Profile:**\n\n{results[0]['content']}\n\n"
                f"*(Note: Gemini response could not be generated: {err})*"
            )
    else:
        # LLM not configured - return direct excerpts
        answer_text = (
            f"Here is what I found in Aman's profile:\n\n"
            + "\n\n".join(f"• **{item['metadata'].get('category', 'Info')}**: {item['content']}" for item in results[:2])
        )

    output: Dict[str, Any] = {
        "answer": answer_text,
        "sources": sources,
        "confidence": confidence,
        "suggestions": suggestions,
    }
    if return_context:
        output["context"] = context

    return output

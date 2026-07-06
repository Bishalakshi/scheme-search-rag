"""
rag.py — RAG pipeline:
1. Embed the user's query
2. Retrieve top-k most similar schemes from ChromaDB
3. Pass retrieved context + query to Gemini
4. Return structured response with citations
"""

import json
import os
import chromadb
import google.generativeai as genai
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

CHROMA_DIR = "./chroma_db"
COLLECTION_NAME = "schemes"
TOP_K = 4  # number of schemes to retrieve per query

# Configure Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-flash-latest") 

# Load ChromaDB once at module level (not per request)
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)
client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_collection(
    name=COLLECTION_NAME,
    embedding_function=embedding_fn,
)


def retrieve(query: str, top_k: int = TOP_K) -> list[dict]:
    """Retrieve top-k most relevant schemes for the query."""
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    retrieved = []
    for i in range(len(results["ids"][0])):
        retrieved.append({
            "id": results["ids"][0][i],
            "document": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "similarity": round(1 - results["distances"][0][i], 3),
        })
    return retrieved


def generate_answer(query: str, retrieved_schemes: list[dict]) -> str:
    """Pass retrieved schemes as context to Gemini and get a cited answer."""

    context = ""
    for i, s in enumerate(retrieved_schemes, 1):
        context += f"\n--- Source {i}: {s['metadata']['name']} ---\n"
        context += s["document"] + "\n"

    prompt = f"""You are SchemeSearch, an expert assistant helping Indian citizens find government schemes they are eligible for.

A user has described their situation. Using ONLY the scheme information provided below as your source, answer their question.

For each relevant scheme:
1. State the scheme name clearly
2. Explain why the user appears eligible based on what they told you
3. Summarize the key benefits in simple language
4. Give the first step to apply

If a scheme from the context is clearly NOT relevant to the user's situation, skip it.
If none of the schemes match, say so honestly — do not invent schemes.
Always end with: "For official information, verify at the scheme's official website or your nearest Common Service Centre (CSC)."

USER'S SITUATION:
{query}

SCHEME CONTEXT:
{context}

Answer in clear, simple English. Use numbered sections for each relevant scheme."""

    response = model.generate_content(prompt)
    return response.text


def search_schemes(query: str) -> dict:
    """
    Main entry point for the RAG pipeline.
    Returns retrieved schemes + generated answer.
    """
    if not query or len(query.strip()) < 10:
        return {
            "answer": "Please describe your situation in more detail so I can find relevant schemes for you.",
            "schemes": [],
        }

    retrieved = retrieve(query)

    # Filter to only reasonably similar results (similarity > 0.3)
    relevant = [s for s in retrieved if s["similarity"] > 0.3]

    if not relevant:
        return {
            "answer": "I couldn't find schemes closely matching your situation. Try describing your occupation, income level, state, or specific need (housing, health, education, etc.).",
            "schemes": [],
        }

    answer = generate_answer(query, relevant)

    return {
        "answer": answer,
        "schemes": [
            {
                "id": s["id"],
                "name": s["metadata"]["name"],
                "category": s["metadata"]["category"],
                "benefits": s["metadata"]["benefits"],
                "how_to_apply": s["metadata"]["how_to_apply"],
                "similarity": s["similarity"],
            }
            for s in relevant
        ],
    }
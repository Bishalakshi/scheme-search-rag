import json
import os
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

CHROMA_DIR = "./chroma_db"
COLLECTION_NAME = "schemes"
TOP_K = 4


class GeminiEmbeddingFunction:
    def __call__(self, input):
        embeddings = []
        for text in input:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
            )
            embeddings.append(result["embedding"])
        return embeddings


client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_collection(
    name=COLLECTION_NAME,
    embedding_function=GeminiEmbeddingFunction(),
)


def retrieve(query, top_k=TOP_K):
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


def generate_answer(query, retrieved_schemes):
    context = ""
    for i, s in enumerate(retrieved_schemes, 1):
        context += f"\n--- Source {i}: {s['metadata']['name']} ---\n"
        context += s["document"] + "\n"

    prompt = f"""You are SchemeSearch, an expert assistant helping Indian citizens find government schemes they are eligible for.

Using ONLY the scheme information provided below, answer the user's situation.

For each relevant scheme:
1. State the scheme name clearly
2. Explain why the user appears eligible
3. Summarize the key benefits in simple language
4. Give the first step to apply

If none match, say so honestly.
Always end with: "For official information, verify at the scheme's official website or your nearest Common Service Centre (CSC)."

USER'S SITUATION:
{query}

SCHEME CONTEXT:
{context}

Answer in clear, simple English. Use numbered sections for each relevant scheme."""

    response = model.generate_content(prompt)
    return response.text


def search_schemes(query):
    if not query or len(query.strip()) < 10:
        return {
            "answer": "Please describe your situation in more detail.",
            "schemes": [],
        }

    retrieved = retrieve(query)
    relevant = [s for s in retrieved if s["similarity"] > 0.3]

    if not relevant:
        return {
            "answer": "I couldn't find schemes closely matching your situation. Try describing your occupation, income level, or specific need.",
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
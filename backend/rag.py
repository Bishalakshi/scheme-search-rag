import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-2.5-flash")

with open("schemes.json", "r", encoding="utf-8") as f:
    SCHEMES = json.load(f)


def keyword_search(query: str, top_k: int = 4) -> list:
    query_words = set(query.lower().split())
    scores = []
    for scheme in SCHEMES:
        text = (
            scheme["name"] + " " +
            scheme["description"] + " " +
            scheme["eligibility"] + " " +
            " ".join(scheme["tags"])
        ).lower()
        score = sum(1 for word in query_words if word in text)
        scores.append((score, scheme))
    scores.sort(key=lambda x: x[0], reverse=True)
    return [s for _, s in scores[:top_k] if _ > 0]


def search_schemes(query: str) -> dict:
    if not query or len(query.strip()) < 10:
        return {
            "answer": "Please describe your situation in more detail.",
            "schemes": [],
        }

    relevant = keyword_search(query)

    if not relevant:
        return {
            "answer": "I couldn't find schemes matching your situation. Try describing your occupation, income level, state, or specific need.",
            "schemes": [],
        }

    context = ""
    for i, s in enumerate(relevant, 1):
        context += f"\n--- Source {i}: {s['name']} ---\n"
        context += f"Category: {s['category']}\n"
        context += f"Description: {s['description']}\n"
        context += f"Eligibility: {s['eligibility']}\n"
        context += f"Benefits: {s['benefits']}\n"

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

Answer in clear, simple English."""

    response = model.generate_content(prompt)

    return {
        "answer": response.text,
        "schemes": [
            {
                "id": s["id"],
                "name": s["name"],
                "category": s["category"],
                "benefits": s["benefits"],
                "how_to_apply": s["how_to_apply"],
                "similarity": 0.8,
            }
            for s in relevant
        ],
    }
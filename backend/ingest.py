import json
import os
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

SCHEMES_FILE = "schemes.json"
CHROMA_DIR = "./chroma_db"
COLLECTION_NAME = "schemes"


def build_text(scheme):
    return (
        f"Scheme Name: {scheme['name']}\n"
        f"Category: {scheme['category']}\n"
        f"Description: {scheme['description']}\n"
        f"Eligibility: {scheme['eligibility']}\n"
        f"Benefits: {scheme['benefits']}\n"
        f"Tags: {', '.join(scheme['tags'])}"
    )


def main():
    print("Loading schemes...")
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)
    print(f"Loaded {len(schemes)} schemes.")

    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )

    client = chromadb.PersistentClient(path=CHROMA_DIR)

    try:
        client.delete_collection(COLLECTION_NAME)
        print("Deleted existing collection.")
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn,
        metadata={"hnsw:space": "cosine"},
    )

    ids = []
    documents = []
    metadatas = []

    for scheme in schemes:
        ids.append(scheme["id"])
        documents.append(build_text(scheme))
        metadatas.append({
            "name": scheme["name"],
            "category": scheme["category"],
            "benefits": scheme["benefits"],
            "how_to_apply": scheme["how_to_apply"],
            "id": scheme["id"],
        })

    print("Generating embeddings and storing in ChromaDB...")
    collection.add(ids=ids, documents=documents, metadatas=metadatas)
    print(f"Done. {len(ids)} schemes stored in ChromaDB at {CHROMA_DIR}")


if __name__ == "__main__":
    main()
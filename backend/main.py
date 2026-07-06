"""
FastAPI backend for SchemeSearch RAG app.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import search_schemes

app = FastAPI(title="SchemeSearch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


@app.get("/")
def root():
    return {"status": "ok", "service": "scheme-search-rag"}


@app.post("/search")
def search(req: SearchRequest):
    if not req.query or len(req.query.strip()) < 5:
        raise HTTPException(status_code=400, detail="Query too short.")
    result = search_schemes(req.query)
    return result


@app.get("/health")
def health():
    return {"status": "healthy"}
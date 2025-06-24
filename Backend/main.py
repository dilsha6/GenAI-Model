# main.py - FastAPI backend with PDF upload, embeddings, and Gemini LLM processing
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction, SentenceTransformerEmbeddingFunction
import uuid
import os
import re
import requests

# Gemini import
import google.generativeai as genai

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup ChromaDB
from chromadb import PersistentClient
chroma_client = PersistentClient(path="./chroma_data")

embedding_func = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
if "documents" not in [c.name for c in chroma_client.list_collections()]:
    chroma_client.create_collection(name="documents", embedding_function=embedding_func)
collection = chroma_client.get_collection("documents")

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

for m in genai.list_models():
    print(m.name, m.supported_generation_methods)

@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        doc.close()

        # Create embedding and store in ChromaDB
        document_id = str(uuid.uuid4())
        collection.add(documents=[text], metadatas=[{"source": file.filename}], ids=[document_id])

        return {"status": "success", "id": document_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class WorkflowInput(BaseModel):
    query: str
    flow: list  # frontend flow config with nodes + connections

@app.post("/run-workflow")
def run_workflow(payload: WorkflowInput):
    print("Received payload:", payload)
    try:
        # Step 1: Find context if KnowledgeBase is in flow
        context = ""
        kb_node = next((node for node in payload.flow if node['data']['label'] == "KnowledgeBase"), None)
        if kb_node:
            results = collection.query(
                query_texts=[payload.query], n_results=3
            )
            context = "\n".join(results["documents"][0])

        # Step 2: Build prompt from LLM node or default
        llm_node = next((node for node in payload.flow if node['data']['label'] == "LLMEngine"), None)
        if llm_node and llm_node['data'].get("prompt"):
            prompt = llm_node['data']['prompt'] + "\n" + context + "\nUser: " + payload.query
        else:
            prompt = payload.query + ("\n" + context if context else "")

        # Step 3: Use LLM model and API key from node config if provided
        model_name = llm_node['data'].get("model", "models/gemini-1.5-pro-latest") if llm_node else "models/gemini-1.5-pro-latest"
        api_key = llm_node['data'].get("apiKey") if llm_node else None
        if api_key:
            genai.configure(api_key=api_key)

        # Step 4: Call Gemini LLM
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        answer = response.text
        return {"response": answer}

    except Exception as e:
        print("⚠️ Backend Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
def search(query: str = Query(...)):
    # Wikipedia summary API
    match = re.match(r"^(what|who) is (.+)", query, re.I)
    if match:
        topic = match.group(2).strip().replace(" ", "_")
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{topic}"
        resp = requests.get(url)
        if resp.ok:
            data = resp.json()
            return {"result": data.get("extract", "No summary found.")}
        return {"result": "No summary found."}
    return {"result": "No search handler for this query."}

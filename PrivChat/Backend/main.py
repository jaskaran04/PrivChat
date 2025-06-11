from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import spacy
import requests
import json

# Load spaCy NER model
nlp = spacy.load("en_core_web_sm")

app = FastAPI()

# Serve static files (frontend)
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
static_path = os.path.join(frontend_path, "static")
app.mount("/static", StaticFiles(directory=static_path), name="static")

# CORS for frontend/backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve HTML
@app.get("/", response_class=HTMLResponse)
async def get_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))

# Pydantic model for request
class InputText(BaseModel):
    text: str

# Main processing endpoint
@app.post("/process")
async def process_text(data: InputText):
    text = data.text

    # 1. Run Ollama (LLaMA 2) via REST API
    try:
        ollama_url = "http://localhost:11434/api/generate"
        ollama_payload = {
            "model": "llama2",
            "prompt": text
        }
        ollama_resp = requests.post(ollama_url, json=ollama_payload)
        llm_output = ""
        for line in ollama_resp.text.strip().splitlines():
            try:
                obj = json.loads(line)
                llm_output += obj.get("response", "")
            except Exception:
                pass
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "LLM call failed", "details": str(e)})

    # 2. Named Entity Recognition
    doc = nlp(text)
    entities = [
        {"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char}
        for ent in doc.ents
    ]

    # 3. Respond
    return {
        "llm_response": llm_output.strip(),
        "entities": entities
    }

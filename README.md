# LLM ChatBot with FastAPI, spaCy NER & Ollama

This project is a minimal yet complete chatbot built using FastAPI, spaCy, and a local LLM served via Ollama. It processes user prompts, detects Named Entities in real-time, and returns an LLM-generated response. This demo emphasizes backend API design and local LLM integration.

---

# Features

* Named Entity Recognition (NER) with spaCy
* Local LLM query via Ollama REST API
* FastAPI backend with clean modular structure
* Lightweight HTML UI for sending prompts
* Bonus: logs entities and LLM responses to the console

---

# Tech Stack

* Backend: FastAPI, Python
* NLP Model: spaCy (`en_core_web_sm`)
* LLM: Ollama (e.g., `llama2`, `mistral`)
* Frontend: HTML + JS
* Environment: Python 3.8+

---

# Project Structure

```
PrivChat-LLM(NER)/
├── structure.txt              
├── backend/
│   ├── __pycache__/           
│   ├── main.py                
│   ├── requirements.txt       
│   └── venv/                  
│
├── frontend/
│   ├── index.html             
│   └── static/
│       ├── style.css          
│       └── app.js             
---

# Setup Instructions

# 1. Clone & Setup Environment

```bash
git clone https://github.com/yourname/llm-chatbot.git
cd llm-chatbot/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

# 2. Start Ollama & Load a Model

Ensure [Ollama](https://ollama.ai/) is installed:

```bash
ollama serve
ollama pull llama2  # or any supported model
```

---

# 3. Launch Backend Server

```bash
uvicorn main:app --reload
```

> Your FastAPI backend should now be live at `http://127.0.0.1:8000`

---

# 4. Use the Frontend

Open `index.html` directly in your browser or host via:

```bash
python -m http.server 8000
```

Visit: `http://localhost:8000/index.html`

---

# How to Use

1. Type a prompt into the input box.
2. Click Send.
3. Check your terminal for:

   * Named Entities detected by spaCy
   * LLM Response returned by Ollama

---

# Troubleshooting

* spaCy not recognizing entities? Confirm `en_core_web_sm` is downloaded.
* No LLM response? Ensure `ollama serve` is active and the model is loaded.
* CORS errors? Access HTML via a local server (`http.server`) not `file://`.

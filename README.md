# GenAI Stack Frontend

This project is a visual flow-based GenAI stack builder and chat interface, built with React and [React Flow](https://reactflow.dev/). It allows you to visually compose generative AI workflows by dragging, dropping, and configuring nodes such as User Query, Knowledge Base, LLM, and Output, and to chat with your stack in real time.

---

## Features

- **Drag & Drop Stack Builder:** Visually create and connect nodes for user queries, knowledge base, LLMs, and output.
- **Node Configuration:** Configure all node parameters directly on the canvas.
- **File Upload:** Upload files to the Knowledge Base node for context extraction.
- **Stack Execution:** Run the full workflow and see the result in the Output node.
- **Chat with Stack:** Open a chat modal to interact with your stack using natural language.
- **AI-Powered Answers:** For "what is ..." or "who is ..." queries, the chat fetches real answers from Wikipedia or your backend.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Python 3.8+](https://www.python.org/) (for backend)
- [pip](https://pip.pypa.io/en/stable/) (for backend dependencies)
- [Gemini API Key](https://ai.google.dev/) (for LLM backend)
- (Optional) [ChromaDB](https://docs.trychroma.com/) and [SentenceTransformers](https://www.sbert.net/) for embeddings

---

## Setup Instructions

### 1. Clone the repository

```sh
git clone github.com/dilsh6/GenAI-Model
cd GenAI
```

### 2. Frontend Setup

```sh
cd genai-stack-frontend
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### 3. Backend Setup

```sh
cd ../Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Create a `.env` file in the `Backend/` directory:**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Start the backend server:**
```sh
uvicorn main:app --reload
```
The backend will run at [http://localhost:8000](http://localhost:8000).

---

## Usage

- **Build a Stack:**  
  Drag components from the sidebar onto the canvas. Connect them in the order: User Query → Knowledge Base → LLM → Output. Configure each node by editing its fields directly.
- **Upload Files:**  
  Click "Upload File" in the Knowledge Base node to attach a document for context extraction. The file is sent to the backend and indexed for semantic search.
- **Run the Stack:**  
  Click "Build Stack" to execute the workflow and see the result in the Output node. The frontend sends the node graph to the backend, which runs the workflow and returns the result.
- **Chat with Stack:**  
  Click "Chat with Stack" to open the chat modal. Ask questions like "what is AI" to get real answers from Wikipedia, or interact with your stack (which can call the backend for LLM answers).

---

## Project Structure

- `genai-stack-frontend/`
  - `src/`
    - `App.js` - Main application and flow logic
    - `components/`
      - `CustomNode.js` - Node rendering and configuration
      - `ChatBox.js` - Chat modal interface
      - `Sidebar.js` - Node palette
      - `UploadPDF.js` - (if present) File upload logic
- `Backend/`
  - `main.py` - FastAPI backend for file upload, embeddings, and LLM workflow
  - `chroma_data/` - Persistent ChromaDB vector store
  - `.env` - API keys and environment variables

---

## Backend API Endpoints

- `POST /upload-document`  
  Upload a PDF (or other supported file) to the knowledge base. The backend extracts text, creates embeddings, and stores them in ChromaDB.

- `POST /run-workflow`  
  Accepts the full node graph and user query.  
  - Extracts context from the knowledge base (if present)
  - Builds the prompt using LLM node config and user query
  - Calls Gemini LLM (or other model) and returns the response

- (Optional) `GET /search?query=...`  
  For chatbox "AI search" queries (e.g., "what is ..."), can return Wikipedia or other search results.

---

## Build for Production

```sh
npm run build
```

The optimized build will be in the `build/` folder.

---

## Troubleshooting

- If you encounter issues, ensure your Node.js, npm, and Python versions are up to date.
- For port conflicts, change the port in the `package.json` or with `PORT=3001 npm start`.
- If backend fails to start, check your `.env` and required Python packages.

---

## License

This project is for educational and prototyping use. See [LICENSE](LICENSE) if present.

---

## Credits

- [React Flow](https://reactflow.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [ChromaDB](https://docs.trychroma.com/)
- [Google Gemini](https://ai.google.dev/)
- [Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API)

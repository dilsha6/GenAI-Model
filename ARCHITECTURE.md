# GenAI Stack Frontend – Architecture & Source Code Overview

This document provides a clear overview of the component structure, modular design, and source code documentation for the GenAI Stack Frontend. It is intended to help developers understand the architecture, key components, their roles, and how they interact.

---

## 1. High-Level Architecture

The application is a modular React SPA (Single Page Application) that enables users to visually build, configure, and interact with generative AI stacks. The main features are implemented using React Flow for the visual canvas, and custom React components for node configuration, chat, and stack management.

```
App
 └── FlowCanvas
      ├── Sidebar
      ├── ReactFlow (canvas)
      │     └── CustomNode (for each node)
      ├── ChatBox (modal)
      └── Other UI (header, modals)
```

---

## 2. Key Components & Their Roles

### App.js
- **Role:** Entry point and main router. Manages stack selection, creation, and launches the builder (`FlowCanvas`).
- **Responsibilities:**
  - Stack list and creation modal
  - Routing between stack list and builder
  - Passes stack name and save handler to `FlowCanvas`

### FlowCanvas (in App.js)
- **Role:** Main builder and workspace for visual stack creation.
- **Responsibilities:**
  - Manages state for nodes, edges, chat, and modal visibility
  - Handles drag-and-drop node creation and connection
  - Implements the workflow execution logic (`runFullWorkflow`)
  - Handles node data updates and file uploads
  - Renders the React Flow canvas and all nodes
  - Controls the "Build Stack" and "Chat with Stack" actions
  - Shows the `ChatBox` modal for stack interaction

### Sidebar.js
- **Role:** Node palette for drag-and-drop.
- **Responsibilities:**
  - Lists available node types (User Query, Knowledge Base, LLM, Output)
  - Handles drag events to initiate node creation

### CustomNode.js
- **Role:** Renders and manages configuration for each node on the canvas.
- **Responsibilities:**
  - Displays node-specific UI (inputs, selects, file upload, etc.)
  - Calls `data.onChange` to update node data in parent state
  - Handles file upload for Knowledge Base nodes
  - Shows output for Output nodes
  - Connects to React Flow’s node system via `Handle`

### ChatBox.js
- **Role:** Modal chat interface for interacting with the built stack.
- **Responsibilities:**
  - Maintains chat history and typing state
  - Accepts user input and displays AI responses
  - Calls `runWorkflow` (from parent) to get AI answers (Wikipedia or simulated)
  - Renders a styled chat UI with header, history, and input

### UploadPDF.js (if present)
- **Role:** Handles file upload logic for Knowledge Base nodes.
- **Responsibilities:**
  - Provides file input and upload feedback
  - Passes uploaded file to parent via callback

---

## 3. Data Flow & Interactions

- **Node Creation:**  
  User drags a node from `Sidebar` to the canvas. `FlowCanvas` creates a new node with default data and handlers.

- **Node Configuration:**  
  Each `CustomNode` renders its own config UI. On change, it calls `data.onChange`, which updates the node’s data in `FlowCanvas` state.

- **File Upload:**  
  The Knowledge Base node’s upload area triggers a hidden file input. On file selection, `data.onUpload` is called, updating the node with the file name.

- **Workflow Execution:**  
  Clicking "Build Stack" runs `runFullWorkflow`, which:
  1. Reads the User Query node’s input.
  2. Simulates context extraction from the Knowledge Base node.
  3. Simulates LLM response using the LLM node’s config.
  4. Updates the Output node with the result.

- **Chat with Stack:**  
  Clicking "Chat with Stack" opens the `ChatBox` modal. User messages are sent to `runWorkflow`, which fetches real answers from Wikipedia for "what is ..." queries, or simulates a response otherwise.

---

## 4. Source Code Documentation

### Example: CustomNode.js

```javascript
/**
 * CustomNode - Renders a configurable node for the GenAI stack builder.
 * Props:
 *   - data: Node data (label, config fields, onChange, onUpload, etc.)
 *   - id: Node ID
 * 
 * Handles:
 *   - Rendering config fields for each node type
 *   - Calling data.onChange(field, value, id) on input change
 *   - Handling file upload for Knowledge Base nodes
 */
const CustomNode = ({ data, id }) => { ... }
```

### Example: runWorkflow (in App.js)

```javascript
/**
 * runWorkflow - Handles chat queries.
 * For "what is ..." or "who is ..." queries, fetches a detailed answer from Wikipedia.
 * For other queries, returns a simulated response.
 * @param {string} query - The user's chat input
 * @returns {Promise<string>} - The AI or search response
 */
async function runWorkflow(query) { ... }
```

---

## 5. Extending & Customizing

- **Add More Node Types:**  
  Add new node definitions in `Sidebar.js` and handle their config in `CustomNode.js`.
- **Integrate Real LLMs:**  
  Replace the simulated LLM logic in `runFullWorkflow` and `runWorkflow` with real API calls.
- **Backend Integration:**  
  Connect file uploads and workflow execution to your backend as needed.

---

## 6. File Structure

```
src/
  App.js
  components/
    CustomNode.js
    ChatBox.js
    Sidebar.js
    UploadPDF.js
  ...
public/
  index.html
  ...
```

---

## 7. Summary

This modular design ensures each component is responsible for a single part of the UI or logic, making the codebase easy to extend and maintain. All data flows through React state and props, with clear separation between visual logic (React Flow), configuration (CustomNode), and interaction (ChatBox).

---
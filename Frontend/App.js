// ✅ genai-stack-frontend/src/App.jsx

import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './components/Sidebar.js';
import CustomNode from './components/CustomNode.js';
import ChatBox from './components/ChatBox.js';

const nodeTypes = {
  custom: CustomNode,
};

function FlowCanvas({ stackName, onSave }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [chatQuery, setChatQuery] = useState('');
  const [outputHistory, setOutputHistory] = useState([]);
  const [outputQuery, setOutputQuery] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatResponse, setChatResponse] = useState('');

  // Track drag state for custom cursor
  const [isDragging, setIsDragging] = useState(false);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const onDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const bounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };

    // Initialize node with prompt if it's LLMEngine
    const newNode = {
      id: `${+new Date()}`,
      type: 'custom',
      position,
      data: {
        label: type,
        ...(type === 'LLMEngine' && { prompt: '' }),
        onChange: handleNodeChange,      // <-- always include this
        onUpload: handleFileUpload,      // <-- for KnowledgeBase
      },
    };
    console.log('CustomNode data:', newNode.data);
    setNodes(nds => nds.concat(newNode));
  };

  const validateWorkflow = () => {
    // Example: check for required nodes and connections
    const hasUserQuery = nodes.some(n => n.data.label === 'UserQuery');
    const hasOutput = nodes.some(n => n.data.label === 'Output');
    if (!hasUserQuery || !hasOutput) {
      alert("Workflow must have both a User Query and Output node.");
      return false;
    }
    // Add more validation as needed
    alert("Workflow is valid and ready!");
    return true;
  };

  async function runFullWorkflow() {
    // 1. Get User Query
    const userQueryNode = nodes.find(n => n.data.label === 'UserQuery');
    const userQuery = userQueryNode?.data.query || '';

    // 2. Get KnowledgeBase context (simulate extraction)
    const kbNode = nodes.find(n => n.data.label === 'KnowledgeBase');
    let context = '';
    if (kbNode) {
      // Simulate extracting context from the file (replace with real backend call)
      context = `Extracted context from file: ${kbNode.data.fileName || 'No file uploaded'}`;
    }

    // 3. Call LLM with context and query
    const llmNode = nodes.find(n => n.data.label === 'LLMEngine');
    let llmResponse = '';
    if (llmNode) {
      // Simulate LLM call (replace with real backend call)
      llmResponse = `LLM Response for query "${userQuery}" with context "${context}"`;
    }

    // 4. Set Output node's data
    setNodes(nds =>
      nds.map(node =>
        node.data.label === 'Output'
          ? { ...node, data: { ...node.data, output: llmResponse } }
          : node
      )
    );
  }

  // Custom drag events for sidebar items
  function handleSidebarDragStart(e) {
    setIsDragging(true);
    // Optionally set a custom drag image
    const dragIcon = document.createElement('div');
    dragIcon.style.padding = '8px 16px';
    dragIcon.style.background = '#2563eb';
    dragIcon.style.color = '#fff';
    dragIcon.style.borderRadius = '8px';
    dragIcon.style.fontWeight = 'bold';
    dragIcon.style.fontSize = '15px';
    dragIcon.innerText = 'Drag to canvas';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 60, 20);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  }
  function handleSidebarDragEnd() {
    setIsDragging(false);
  }

  // Handler to update any node's data from inside CustomNode
  function handleNodeChange(field, value, nodeId) {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
                onChange: handleNodeChange,   // always keep this!
                onUpload: handleFileUpload,   // always keep this!
              }
            }
          : node
      )
    );
  }

  // Handler for file upload (stub)
  function handleFileUpload(nodeId, file) {
    // You can upload the file to your backend here if needed
    // For now, just update the node with the file name (already handled in CustomNode)
    alert(`File "${file.name}" uploaded for node ${nodeId}`);
  }

  // Simulate running the stack and getting a response
  async function runWorkflow(query) {
    // If the query is "what is ..." or "who is ..." etc.
    const match = query.match(/^(what|who) is (.+)/i);
    if (match) {
      const topic = match[2].trim().replace(/\?$/, '').replace(/\s+/g, '_');
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.extract) return data.extract;
          if (data.type === 'disambiguation') return "This topic is ambiguous. Please be more specific.";
        }
        return "Sorry, I couldn't find an answer for that.";
      } catch (e) {
        return "Sorry, there was an error searching for your answer.";
      }
    }

    // Fallback: echo or your LLM logic
    return `🤖 AI: You said "${query}". This is a simulated response.`;
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header Bar */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: '1px solid #e5e7eb',
        background: '#fff',
        zIndex: 2,
        position: 'sticky',
        top: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontWeight: 700,
            fontSize: 20,
            color: '#2563eb',
            letterSpacing: 0.5
          }}>
            {stackName || "Untitled Stack"}
          </span>
        </div>
        <button
          onClick={onSave}
          style={{
            background: '#fff',
            color: '#2563eb',
            border: '1.5px solid #2563eb',
            borderRadius: 6,
            padding: '8px 22px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(96,165,250,0.10)',
            transition: 'background 0.2s',
          }}
        >
          Save
        </button>
      </div>
      {/* Main builder area */}
      <div style={{ flexGrow: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <Sidebar
          setNodes={setNodes}
          onDragStart={handleSidebarDragStart}
          onDragEnd={handleSidebarDragEnd}
          style={{
            width: 220,
            background: '#fff',
            borderRight: '1.5px solid #e5e7eb',
            padding: '24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            zIndex: 3
          }}
        />
        {/* Canvas */}
        <div style={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={(event) => event.preventDefault()}
            // Remove onNodeClick handler to disable node selection popups
            nodeTypes={nodeTypes}
            fitView
            snapToGrid={true}
            snapGrid={[20, 20]}
            style={{ background: 'transparent', minHeight: '100%' }}
          >
            <Background color="#e5e7eb" gap={24} />
            <Controls position="bottom-right" />
            <MiniMap />
          </ReactFlow>
          {/* Central drag-and-drop guide */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <div style={{
                fontSize: 44,
                color: '#2563eb',
                marginBottom: 8,
                opacity: 0.7
              }}>🖱️</div>
              <div style={{
                fontWeight: 600,
                fontSize: 20,
                color: '#2563eb',
                opacity: 0.85
              }}>
                Drag & drop components to get started
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, margin: '16px 0 8px 0' }}>
            <button
            onClick={runFullWorkflow}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
              boxShadow: '0 4px 24px rgba(96,165,250,0.18)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 100
            }}
            title="Build Stack"
          >
            ▶
          </button>
            <button
              onClick={() => setShowChatModal(true)}
              style={{
                padding: '8px 18px',
                background: '#818cf8',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Chat with Stack
            </button>
          </div>

          {/* ChatBox Modal */}
          {showChatModal && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.18)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
                width: 480,
                maxWidth: '95vw',
                padding: '0',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowChatModal(false)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 14,
                    background: 'none',
                    border: 'none',
                    fontSize: 22,
                    color: '#888',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  aria-label="Close"
                >×</button>
                <ChatBox
                  chatQuery={chatQuery}
                  setChatQuery={setChatQuery}
                  chatResponse={chatResponse}
                  runWorkflow={runWorkflow}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add this modal component in your App.js file
function CreateStackModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.18)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
        width: 400,
        maxWidth: '90vw',
        padding: '28px 28px 18px 28px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#888',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >×</button>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Create New Stack</h3>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 500, fontSize: 15 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              marginTop: 4,
              marginBottom: 12,
              padding: '8px 10px',
              borderRadius: 6,
              border: '1.5px solid #e5e7eb',
              fontSize: 15
            }}
          />
          <label style={{ fontWeight: 500, fontSize: 15 }}>Description</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{
              width: '100%',
              minHeight: 80,
              marginTop: 4,
              padding: '8px 10px',
              borderRadius: 6,
              border: '1.5px solid #e5e7eb',
              fontSize: 15,
              resize: 'vertical'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate({ name, desc });
              setName('');
              setDesc('');
            }}
            disabled={!name.trim()}
            style={{
              background: !name.trim() ? '#e5e7eb' : '#22c55e',
              color: !name.trim() ? '#a3a3a3' : '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 22px',
              fontWeight: 600,
              fontSize: 15,
              cursor: !name.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// In your main App component:
export default function App() {
  const [stacks, setStacks] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStack, setSelectedStack] = useState(null);

  function handleCreateStack(stack) {
    setStacks(prev => [...prev, stack]);
    setShowModal(false);
  }

  function handleEditStack(idx) {
    setSelectedStack(idx);
    setShowBuilder(true);
  }

  function handleSaveStack() {
    // Implement your save logic here (e.g., persist to backend/localStorage)
    alert('Stack saved!');
  }

  return showBuilder ? (
    <ReactFlowProvider>
      <FlowCanvas
        stackName={selectedStack !== null ? stacks[selectedStack]?.name : ""}
        onSave={handleSaveStack}
      />
    </ReactFlowProvider>
  ) : (
    <>
      <StacksPage
        stacks={stacks}
        onCreate={() => setShowModal(true)}
        onEdit={handleEditStack}
      />
      <CreateStackModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateStack}
      />
    </>
  );
}

function StacksPage({ stacks, onCreate, onEdit }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
    }}>
      <header style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: '1px solid #e5e7eb',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/favicon.ico" alt="logo" style={{ width: 28, height: 28 }} />
          <span style={{ fontWeight: 700, fontSize: 20 }}>GenAI Stack</span>
        </div>
        <button
          style={{
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer'
          }}
          onClick={onCreate}
        >
          + New Stack
        </button>
      </header>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, margin: '32px 0 12px 0' }}>My Stacks</h2>
        <div style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          {stacks.length === 0 ? (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              padding: '40px 48px',
              textAlign: 'center',
              border: '1px solid #e5e7eb',
              margin: '40px auto'
            }}>
              <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Create New Stack</h3>
              <div style={{ color: '#64748b', fontSize: 16, marginBottom: 18 }}>
                Start building your generative AI apps with our essential tools and frameworks
              </div>
              <button
                style={{
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 24px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer'
                }}
                onClick={onCreate}
              >
                + New Stack
              </button>
            </div>
          ) : (
            stacks.map((stack, idx) => (
              <div key={idx} style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                padding: '28px 32px 24px 32px',
                minWidth: 240,
                maxWidth: 260,
                marginBottom: 24,
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{stack.name}</div>
                  <div style={{ color: '#64748b', fontSize: 15, marginBottom: 18 }}>{stack.desc}</div>
                </div>
                <button
                  onClick={() => onEdit(idx)}
                  style={{
                    background: '#fff',
                    color: '#22223b',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '8px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  Edit Stack <span style={{ fontSize: 16 }}>↗</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

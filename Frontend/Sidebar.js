import React from 'react';

const COMPONENTS = [
  { type: 'UserQuery', label: 'User Query', icon: '💬' },
  { type: 'KnowledgeBase', label: 'Knowledge Base', icon: '📚' },
  { type: 'LLMEngine', label: 'LLM ', icon: '🤖' },
  { type: 'Output', label: 'Output', icon: '📤' },
];

export default function Sidebar({ setNodes }) {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      style={{
        width: 260,
        padding: '0 0 24px 0',
        background: 'linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)',
        borderRight: '1.5px solid #e5e7eb',
        boxShadow: '2px 0 16px rgba(0,0,0,0.05)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      {/* Logo/Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '28px 24px 18px 24px',
          borderBottom: '1.5px solid #e5e7eb',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            boxShadow: '0 2px 8px rgba(96,165,250,0.10)',
          }}
        >
          ⚡
        </span>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#2d3748', letterSpacing: 0.5 }}>
          GenAI Flow
        </span>
      </div>
      {/* Section Title */}
      <div style={{ padding: '0 24px', marginBottom: 8 }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#475569', letterSpacing: 0.2 }}>
          Components
        </h4>
      </div>
      {/* Draggable Components */}
      <div style={{ flex: 1, padding: '0 16px' }}>
        {COMPONENTS.map((comp) => (
          <div
            key={comp.type}
            onDragStart={(event) => handleDragStart(event, comp.type)}
            draggable
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              margin: '10px 0',
              background: '#fff',
              border: '2px solid #e0e7ef',
              borderRadius: 12,
              cursor: 'grab',
              fontWeight: 500,
              fontSize: 15,
              color: '#374151',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              transition: 'background 0.18s, box-shadow 0.18s, border 0.18s, color 0.18s',
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #e0e7ef 0%, #f1f5f9 100%)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(96,165,250,0.10)';
              e.currentTarget.style.border = '2px solid #60a5fa';
              e.currentTarget.style.color = '#2563eb';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
              e.currentTarget.style.border = '2px solid #e0e7ef';
              e.currentTarget.style.color = '#374151';
            }}
            onFocus={e => {
              e.currentTarget.style.border = '2px solid #818cf8';
              e.currentTarget.style.boxShadow = '0 0 0 2px #818cf855';
            }}
            onBlur={e => {
              e.currentTarget.style.border = '2px solid #e0e7ef';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
          >
            <span style={{ fontSize: 20 }}>{comp.icon}</span>
            {comp.label}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '16px 24px 0 24px', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
        <span>© {new Date().getFullYear()} GenAI Stack</span>
      </div>
    </aside>
  );
}

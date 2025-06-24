import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, id }) => {
  const fileInputRef = useRef();

  const handleChange = (field, value) => {
    if (typeof data.onChange === 'function') {
      data.onChange(field, value, id);
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // allow re-uploading the same file
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && typeof data.onUpload === 'function') {
      data.onUpload(id, file);
      // Optionally update the node with the file name
      handleChange('fileName', file.name);
    }
  };

  return (
    <div style={{
      padding: 0,
      borderRadius: 12,
      border: '2px solid #2563eb',
      backgroundColor: '#fff',
      minWidth: 320,
      boxShadow: '0 2px 12px rgba(96,165,250,0.08)',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Node Header */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        padding: '10px 16px 8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#22223b' }}>
          {data.label === 'UserQuery' ? 'User Query'
            : data.label === 'LLMEngine' ? 'LLM (OpenAI)'
            : data.label === 'KnowledgeBase' ? 'Knowledge Base'
            : data.label === 'Output' ? 'Output'
            : data.label}
        </span>
        <span style={{ fontSize: 18, color: '#888' }}>
          <i className="fa fa-cog" />
        </span>
      </div>
      {/* Node Content */}
      {data.label === 'UserQuery' && (
        <div style={{ padding: '12px 16px 10px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            background: '#f1f5f9',
            borderRadius: 6,
            padding: '7px 10px',
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            marginBottom: 6
          }}>
            Enter point for querys
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            User Query
          </label>
          <textarea
            value={data.query || ''}
            onChange={e => handleChange('query', e.target.value)}
            placeholder="Write your query here"
            style={{
              width: '100%',
              minHeight: 38,
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 15,
              padding: '8px 10px',
              resize: 'none',
              color: '#222'
            }}
          />
        </div>
      )}
      {data.label === 'LLMEngine' && (
        <div style={{ padding: '12px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: '#f1f5f9',
            borderRadius: 6,
            padding: '7px 10px',
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            marginBottom: 6
          }}>
            Run a query with OpenAI LLM
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            Model
          </label>
          <select
            value={data.model || ''}
            onChange={e => handleChange('model', e.target.value)}
            style={{
              width: '100%',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 15,
              padding: '8px 10px',
              marginBottom: 4
            }}
          >
            <option value="">Select</option>
            <option value="gpt-4o">GPT 4o- Mini</option>
            <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
          </select>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            API Key
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="password"
              value={data.apiKey || ''}
              onChange={e => handleChange('apiKey', e.target.value)}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 15,
                padding: '8px 10px',
                marginBottom: 4
              }}
              placeholder="API Key"
            />
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            Prompt
          </label>
          <textarea
            value={data.prompt || ''}
            onChange={e => handleChange('prompt', e.target.value)}
            placeholder="Prompt"
            style={{
              width: '100%',
              minHeight: 60,
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 15,
              padding: '8px 10px',
              marginBottom: 4,
              color: '#222'
            }}
          />
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            Temperature
          </label>
          <select
            value={data.temperature || '0.75'}
            onChange={e => handleChange('temperature', e.target.value)}
            style={{
              width: '100%',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 15,
              padding: '8px 10px',
              marginBottom: 4
            }}
          >
            <option value="0.25">0.25</option>
            <option value="0.5">0.5</option>
            <option value="0.75">0.75</option>
            <option value="1">1</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: '#222', fontWeight: 600 }}>WebSearch Tool</span>
            <input
              type="checkbox"
              checked={!!data.webSearch}
              onChange={e => handleChange('webSearch', e.target.checked)}
              style={{ accentColor: '#22c55e', width: 18, height: 18 }}
            />
            <span style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: data.webSearch ? '#22c55e' : '#e5e7eb',
              display: 'inline-block',
              marginLeft: 4
            }} />
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            SERF API
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="password"
              value={data.serfApi || ''}
              onChange={e => handleChange('serfApi', e.target.value)}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 15,
                padding: '8px 10px',
                marginBottom: 4
              }}
              placeholder="SERF API"
            />
          </div>
        </div>
      )}
      {data.label === 'KnowledgeBase' && (
        <div style={{ padding: '12px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: '#f1f5f9',
            borderRadius: 6,
            padding: '7px 10px',
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            marginBottom: 6
          }}>
            Let LLM search info in your file
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            File for Knowledge Base
          </label>
          <div
            style={{
              border: '1.5px dashed #22c55e',
              borderRadius: 10,
              padding: '18px 0',
              textAlign: 'center',
              color: '#22c55e',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 4,
              background: '#f8fff8'
            }}
            onClick={handleFileClick}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {data.fileName ? (
                <>
                  <span style={{ color: '#222', fontWeight: 500 }}>{data.fileName}</span>
                  <span style={{ fontSize: 18 }}>✅</span>
                </>
              ) : (
                <>
                  Upload File <span style={{ fontSize: 18 }}>📤</span>
                </>
              )}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".pdf,.txt,.doc,.docx,.csv,.json"
            />
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            Embedding Model
          </label>
          <select
            value={data.embeddingModel || 'text-embedding-3-large'}
            onChange={e => handleChange('embeddingModel', e.target.value)}
            style={{
              width: '100%',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 15,
              padding: '8px 10px',
              marginBottom: 4
            }}
          >
            <option value="text-embedding-3-large">text-embedding-3-large</option>
            <option value="text-embedding-ada-002">text-embedding-ada-002</option>
          </select>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            API Key
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="password"
              value={data.apiKey || ''}
              onChange={e => handleChange('apiKey', e.target.value)}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 15,
                padding: '8px 10px',
                marginBottom: 4
              }}
              placeholder="API Key"
            />
          </div>
        </div>
      )}
      {data.label === 'Output' && (
        <div style={{ padding: '12px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: '#f1f5f9',
            borderRadius: 6,
            padding: '7px 10px',
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            marginBottom: 6
          }}>
            Output of the result nodes as text
          </div>
          <label style={{ fontSize: 13, color: '#222', fontWeight: 600, marginBottom: 4 }}>
            Output Text
          </label>
          <div style={{
            width: '100%',
            minHeight: 38,
            borderRadius: 8,
            border: '1.5px solid #e5e7eb',
            fontSize: 15,
            padding: '12px 10px',
            background: '#f8fafc',
            color: data.output ? '#222' : '#aaa'
          }}>
            {data.output || 'Output will be generated based on query'}
          </div>
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ background: '#2563eb' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#2563eb' }} />
    </div>
  );
};

export default CustomNode;

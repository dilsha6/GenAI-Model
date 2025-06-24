// ✅ genai-stack-frontend/src/components/UploadPDF.js

import React, { useState } from 'react';

export default function UploadPDF({ nodeId }) {
  const [fileName, setFileName] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert(`✅ File uploaded successfully for node ${nodeId}`);
      } else {
        alert('❌ Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Upload error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      margin: '16px 0',
      padding: 16,
      background: 'linear-gradient(90deg, #f1f5f9 60%, #e0e7ef 100%)',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1.5px solid #e5e7eb',
    }}>
      <label style={{
        fontWeight: 600,
        color: '#2563eb',
        marginBottom: 6,
        fontSize: 15,
      }}>
        Upload PDF:
      </label>
      <label
        htmlFor={`pdf-upload-${nodeId}`}
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: 'linear-gradient(90deg, #60a5fa 0%, #818cf8 100%)',
          color: '#fff',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 15,
          boxShadow: '0 2px 8px rgba(96,165,250,0.10)',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)'}
        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #60a5fa 0%, #818cf8 100%)'}
      >
        Select PDF
        <input
          id={`pdf-upload-${nodeId}`}
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </label>
      {fileName && (
        <span style={{
          marginTop: 4,
          color: '#2563eb',
          fontSize: 14,
          fontWeight: 500,
          wordBreak: 'break-all'
        }}>
          📄 {fileName}
        </span>
      )}
    </div>
  );
}

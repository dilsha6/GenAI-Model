import React, { useState } from 'react';

export default function ChatBox({ chatQuery, setChatQuery, chatResponse, runWorkflow }) {
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!chatQuery.trim()) return;

    const userMsg = { role: 'user', text: chatQuery, time: new Date().toLocaleTimeString() };
    setHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Get the response from runWorkflow
    const response = await runWorkflow(chatQuery);

    const assistantMsg = {
      role: 'assistant',
      text: response || "⚠️ No response received.",
      time: new Date().toLocaleTimeString(),
    };
    setHistory(prev => [...prev, assistantMsg]);
    setIsTyping(false);
    setChatQuery('');
  };

  // SVG logo for GenAI
  const GenAILogo = (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      background: '#22c55e',
      borderRadius: '50%',
      marginRight: 10,
    }}>
      <span style={{
        color: '#fff',
        fontWeight: 700,
        fontSize: 18,
        fontFamily: 'Inter, Arial, sans-serif',
        letterSpacing: -1,
      }}>ai</span>
    </span>
  );

  return (
    <div style={{
      width: 700,
      maxWidth: '96vw',
      height: 500,
      maxHeight: '90vh',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        height: 60,
        background: 'linear-gradient(90deg, #f8fafc 0%, #e0ffe7 100%)',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        fontWeight: 700,
        fontSize: 20,
        color: '#22223b',
        letterSpacing: 0.2,
        gap: 10,
      }}>
        {GenAILogo}
        GenAI Stack Chat
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: history.length === 0 ? 'center' : 'flex-start',
        alignItems: 'center',
        background: '#fcfcfc',
        padding: history.length === 0 ? 0 : '32px 0 16px 0',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {history.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            minHeight: 320,
            color: '#22223b',
            opacity: 0.95,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              {GenAILogo}
              <span style={{ fontWeight: 700, fontSize: 22 }}>GenAI Stack Chat</span>
            </div>
            <div style={{
              fontSize: 17,
              color: '#64748b',
              marginTop: 4,
              textAlign: 'center',
              fontWeight: 500,
            }}>
              Start a conversation to test your stack
            </div>
          </div>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: 540,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            {history.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 2,
              }}>
                <div style={{
                  background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                  color: msg.role === 'user' ? '#fff' : '#22223b',
                  borderRadius: 18,
                  padding: '12px 18px',
                  fontSize: 15,
                  maxWidth: '80%',
                  boxShadow: msg.role === 'user'
                    ? '0 2px 8px rgba(37,99,235,0.08)'
                    : '0 2px 8px rgba(100,116,139,0.06)',
                }}>
                  {msg.text}
                </div>
                <span style={{
                  fontSize: 11,
                  color: '#a0aec0',
                  marginTop: 2,
                  marginRight: msg.role === 'user' ? 6 : 0,
                  marginLeft: msg.role === 'assistant' ? 6 : 0,
                }}>
                  {msg.role === 'user' ? 'You' : 'AI'} · {msg.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginLeft: 6,
              }}>
                <div style={{
                  background: '#f1f5f9',
                  color: '#22223b',
                  borderRadius: 18,
                  padding: '12px 18px',
                  fontSize: 15,
                  minWidth: 60,
                }}>
                  AI is typing...
                </div>
                <div style={{
                  display: 'flex',
                  gap: 2,
                  marginLeft: 2,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#a0aec0', opacity: 0.7, animation: 'blink 1.4s infinite both'
                  }} />
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#a0aec0', opacity: 0.7, animation: 'blink 1.4s infinite both', animationDelay: '0.2s'
                  }} />
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#a0aec0', opacity: 0.7, animation: 'blink 1.4s infinite both', animationDelay: '0.4s'
                  }} />
                </div>
                <style>
                  {`@keyframes blink { 0%,80%,100%{opacity:0.2;} 40%{opacity:1;} }`}
                </style>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        borderTop: '1px solid #f1f5f9',
        background: '#fff',
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <input
          type="text"
          value={chatQuery}
          onChange={e => setChatQuery(e.target.value)}
          placeholder="Send a message"
          style={{
            flex: 1,
            padding: '13px 18px',
            borderRadius: 12,
            border: '1.5px solid #e5e7eb',
            fontSize: 16,
            background: '#f8fafc',
            color: '#22223b',
            outline: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            transition: 'border 0.2s',
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          onClick={handleSend}
          style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 100%)',
            border: 'none',
            borderRadius: 10,
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
            transition: 'background 0.2s',
          }}
          title="Send"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M3 20l18-8-18-8v7l13 1-13 1v7z" fill="#fff"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

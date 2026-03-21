import React, { useState, useRef, useEffect } from 'react';
import './guide-chat.css';

/**
 * GuideChat - A native-based, premium chat assistant for the MyClaw platform.
 * 
 * Modeled after 'Cody for Hostinger', providing contextual guidance, sitemaps,
 * and feature discovery while adhering to A.I.M.S. IP protection standards.
 */

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  attachment?: {
    type: 'audio' | 'document';
    url: string;
    label: string;
  };
}

const GuideChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      type: 'bot',
      content: 'Welcome to ACHIEVEMOR. I am your platform navigator. How can I assist your mission today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // API call to the backend AIMS acheevy endpoint
      const response = await fetch('/api/chat/acheevy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.map(m => ({ role: m.type === 'bot' ? 'assistant' : 'user', content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Failed to reach ACHIEVEMOR');

      const data = await response.json();
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: data.reply,
        timestamp: new Date().toISOString(),
        attachment: data.attachment
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('[ACHIEVEMOR Error]', error);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        type: 'bot',
        content: "I've encountered a secure link disruption. Please try again in a moment.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="guide-chat-root">
      {/* Floating Trigger */}
      <div className="guide-bubble" onClick={handleToggle} aria-label="Open support guide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
        </svg>
      </div>

      {/* Chat Panel */}
      <div className={`guide-panel ${isOpen ? 'active' : ''}`}>
        <div className="guide-header">
          <div className="guide-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="guide-header-status">
            <span className="guide-header-title">chat W/ ACHIEVEMOR</span>
            <span className="guide-header-tagline">Adaptive Platform Intelligence</span>
          </div>
          <button className="guide-close-btn" onClick={handleToggle} title="Close guide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="guide-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`guide-message ${msg.type}`}>
              <div className="guide-msg-content">{msg.content}</div>
              {msg.attachment && (
                <div className="guide-attachment">
                  {msg.attachment.type === 'audio' ? (
                    <div className="audio-player">
                      <div className="audio-label">🎙️ {msg.attachment.label}</div>
                      <audio controls src={msg.attachment.url} className="custom-audio" />
                    </div>
                  ) : (
                    <a href={msg.attachment.url} target="_blank" rel="noreferrer" className="doc-link">
                      📄 {msg.attachment.label}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="guide-message bot">
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="guide-input-container">
          <div className="guide-input-wrapper">
            <input
              className="guide-input"
              type="text"
              placeholder="How can I help you today?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="chat W/ ACHIEVEMOR"
            />
            <button className="guide-send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideChat;

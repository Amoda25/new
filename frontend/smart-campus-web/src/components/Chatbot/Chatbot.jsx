import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your Smart Campus AI assistant. Ask me about bookings, resources, tickets, or system features.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/chatbot/ask", {
        message: userText,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, chatbot service is not available right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="cb-wrapper">

      {/* ── Floating toggle button ── */}
      <button
        className={`cb-toggle ${open ? "cb-toggle-active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle AI Chat"
      >
        <span className="cb-toggle-ring" />
        <span className="cb-toggle-ring cb-ring2" />
        <span className="cb-toggle-icon">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a10 10 0 0 1 10 10c0 4.42-2.87 8.17-6.84 9.5L12 22l-3.16-0.5C4.87 20.17 2 16.42 2 12A10 10 0 0 1 12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="8.5" cy="12" r="1.2" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
              <circle cx="15.5" cy="12" r="1.2" fill="currentColor"/>
            </svg>
          )}
        </span>
        {!open && <span className="cb-toggle-label">AI</span>}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div className="cb-panel">

  

          {/* ── Header ── */}
          <div className="cb-header">
            <div className="cb-header-dots">
              {[...Array(12)].map((_, i) => (
                <span key={i} className="cb-hdot" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <div className="cb-header-main">
              <div className="cb-avatar">
                <span className="cb-avatar-pulse" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a10 10 0 0 1 10 10c0 4.42-2.87 8.17-6.84 9.5L12 22l-3.16-0.5C4.87 20.17 2 16.42 2 12A10 10 0 0 1 12 2z" stroke="#60a5fa" strokeWidth="1.8"/>
                  <circle cx="8.5" cy="12" r="1.2" fill="#60a5fa"/>
                  <circle cx="12" cy="12" r="1.2" fill="#60a5fa"/>
                  <circle cx="15.5" cy="12" r="1.2" fill="#60a5fa"/>
                </svg>
              </div>
              <div className="cb-header-text">
                <span className="cb-header-title">Campus AI</span>
                <span className="cb-header-status">
                  <span className="cb-status-dot" /> Online · Smart Assistant
                </span>
              </div>
            </div>
            <button className="cb-close-btn" onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Messages ── */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`cb-row ${msg.sender === "user" ? "cb-row-user" : "cb-row-bot"}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {msg.sender === "bot" && (
                  <div className="cb-bot-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.42-2.87 8.17-6.84 9.5L12 22l-3.16-0.5C4.87 20.17 2 16.42 2 12A10 10 0 0 1 12 2z" stroke="#60a5fa" strokeWidth="2"/>
                      <circle cx="8.5" cy="12" r="1.1" fill="#60a5fa"/>
                      <circle cx="12" cy="12" r="1.1" fill="#60a5fa"/>
                      <circle cx="15.5" cy="12" r="1.1" fill="#60a5fa"/>
                    </svg>
                  </div>
                )}
                <div className={`cb-bubble ${msg.sender === "user" ? "cb-bubble-user" : "cb-bubble-bot"}`}>
                  {msg.text}
                  {msg.sender === "bot" && <span className="cb-bubble-corner" />}
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {loading && (
              <div className="cb-row cb-row-bot">
                <div className="cb-bot-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2a10 10 0 0 1 10 10c0 4.42-2.87 8.17-6.84 9.5L12 22l-3.16-0.5C4.87 20.17 2 16.42 2 12A10 10 0 0 1 12 2z" stroke="#60a5fa" strokeWidth="2"/>
                    <circle cx="8.5" cy="12" r="1.1" fill="#60a5fa"/>
                    <circle cx="12" cy="12" r="1.1" fill="#60a5fa"/>
                    <circle cx="15.5" cy="12" r="1.1" fill="#60a5fa"/>
                  </svg>
                </div>
                <div className="cb-bubble cb-bubble-bot cb-typing">
                  <span className="cb-wave-dot" style={{ animationDelay: "0s" }} />
                  <span className="cb-wave-dot" style={{ animationDelay: "0.18s" }} />
                  <span className="cb-wave-dot" style={{ animationDelay: "0.36s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input area ── */}
          <div className="cb-input-area">
            <div className="cb-input-wrap">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about campus…"
                className="cb-input"
              />
              <button
                onClick={sendMessage}
                className={`cb-send ${input.trim() ? "cb-send-active" : ""}`}
                disabled={!input.trim()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="cb-footer-note">
              Powered by Smart Campus AI · Press Enter to send
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

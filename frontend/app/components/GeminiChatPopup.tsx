"use client";
import React, { useState, useRef, useEffect } from "react";
import { sendMessageToGemini } from "../services/geminiService";

interface ChatMessage {
  sender: "user" | "ia";
  text: string;
}

const GeminiChatPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático pro fim
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const iaReply = await sendMessageToGemini(userMsg.text);

      // Se vier JSON, tenta extrair texto; senão mostra direto
      let cleanText = iaReply;
      try {
        const parsed = JSON.parse(iaReply);
        cleanText = parsed.text || parsed.reply || iaReply;
      } catch {
        cleanText = iaReply;
      }

      setMessages((msgs) => [...msgs, { sender: "ia", text: cleanText }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ia", text: "Erro ao conectar com a IA." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Botão de abrir o chat */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1000,
          background: "#22223b",
          color: "#fff",
          borderRadius: "24px",
          padding: "12px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        💬 Chat IA
      </button>

      {/* Janela do chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 32,
            bottom: 80,
            zIndex: 1001,
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            width: 360,
            height: 480,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              padding: "14px 16px",
              background: "#22223b",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Chat IA
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Mensagens */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#f7f7fa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  color: "#777",
                  textAlign: "center",
                  marginTop: "40px",
                }}
              >
                Converse com a IA sobre finanças, investimentos e economia.
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                  maxWidth: "80%",
                }}
              >
                <div
                  style={{
                    background:
                      msg.sender === "user" ? "#7c3aed" : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "#111",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    fontSize: "15px",
                    whiteSpace: "pre-line",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  color: "#7c3aed",
                  textAlign: "center",
                  fontSize: "14px",
                  margin: "8px 0",
                }}
              >
                IA está digitando...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Campo de envio */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: "8px 10px",
                fontSize: "14px",
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: "#22223b",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChatPopup;

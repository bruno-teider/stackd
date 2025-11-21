"use client";
import React, { useState, useRef, useEffect } from "react";
import { sendMessageToGemini } from "../services/geminiService";

interface ChatMessage {
  sender: "user" | "ia";
  text: string;
}

const perguntasPadrao = [
  "O que é uma ação?",
  "O que significa dividendos?",
  "O que é liquidez no mercado?",
  "Como funciona uma Bolsa de Valores?",
  "O que é volatilidade?",
  "O que é preço/lucro (P/L)?",
];

const StockHelpPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enviarMsg = async (text: string) => {
    const userMsg = { sender: "user" as const, text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const ia = await sendMessageToGemini(text);

      let cleanText = ia;
      try {
        const parsed = JSON.parse(ia);
        cleanText = parsed.text ?? ia;
      } catch {}

      setMessages((m) => [...m, { sender: "ia", text: cleanText }]);
    } catch {
      setMessages((m) => [
        ...m,
        { sender: "ia", text: "Erro ao conectar com a IA." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          left: 24,
          bottom: 24,
          zIndex: 999,
          background: "#7c3aed",
          color: "white",
          width: 54,
          height: 54,
          borderRadius: "50%",
          fontSize: 28,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.28)",
        }}
      >
        ?
      </button>

      {/* POPUP */}
      {open && (
        <div
          style={{
            position: "fixed",
            left: 32,
            bottom: 80,
            width: 380,
            height: 520,
            background: "white",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#7c3aed",
              color: "white",
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Ajuda — Ações
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* PERGUNTAS */}
          <div
            style={{
              padding: "12px 16px",
              background: "#faf5ff",
              borderBottom: "1px solid #e6d7ff",
              maxHeight: 180,
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontSize: 14,
                color: "#4b0082",
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Perguntas rápidas
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {perguntasPadrao.map((p, i) => (
                <button
                  key={i}
                  onClick={() => enviarMsg(p)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: "#f3e8ff",
                    border: "1px solid #d6b8ff",
                    textAlign: "left",
                    color: "#4b0082",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* CHAT */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              background: "#fafafa",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Mensagem inicial */}
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: "#7c3aed",
                  fontSize: 14,
                  opacity: 0.8,
                }}
              >
                Selecione uma pergunta acima.
              </div>
            )}

            {/* Mensagens */}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: 12,
                  maxWidth: "80%",
                }}
              >
                <div
                  style={{
                    background:
                      msg.sender === "user" ? "#7c3aed" : "#e5e5e5",
                    color: msg.sender === "user" ? "white" : "#111",
                    padding: "10px 14px",
                    borderRadius: 14,
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{ color: "#7c3aed", textAlign: "center", marginTop: 10 }}
              >
                Processando...
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>
      )}
    </>
  );
};

export default StockHelpPopup;

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOT_AVATAR = (
  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--color-volt)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
  </div>
);

const USER_AVATAR = (
  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#333", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px", fontWeight: "bold" }}>
    TÚ
  </div>
);

const INITIAL_MESSAGES = [
  { id: 1, sender: "bot", text: "¡Hola! Soy el AI Stylist de Nike Legado. ¿Para qué ocasión estás buscando un outfit hoy? (Ej: Entrenar, salir de noche, casual...)" }
];

export default function StylistChat({ onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      const lowerInput = userMessage.text.toLowerCase();
      let responseText = "Esa es una excelente elección. Te recomendaría combinarlo con unos Nike Air Force 1 para un look más clásico, o unos Air Max Plus si buscas algo más atrevido.";
      let productSuggestion = null;

      if (lowerInput.includes("noche") || lowerInput.includes("salir")) {
        responseText = "Para salir de noche, necesitas algo con presencia. Te sugiero un look 'All Black' contrastado con estas joyas:";
        productSuggestion = { name: 'Nike Dunk High "Inca Heritage"', price: "$189.99", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80" };
      } else if (lowerInput.includes("entrenar") || lowerInput.includes("gym") || lowerInput.includes("correr")) {
        responseText = "El rendimiento es clave. Para máxima comodidad y soporte en tu entrenamiento, esta es mi recomendación top:";
        productSuggestion = { name: "Nike Pegasus 40", price: "$129.99", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80" };
      } else {
        responseText = "Perfecto, un estilo versátil. Basado en las tendencias actuales de la comunidad de Quito y Guayaquil, este modelo está marcando la pauta:";
        productSuggestion = { name: 'Nike Air Max Plus "Barrio Drop"', price: "$199.99", img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=200&q=80" };
      }

      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: "bot", text: responseText, product: productSuggestion }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      style={{ flex: 1, display: "flex", flexDirection: "column", background: "#050505", borderRadius: "12px", border: "1px solid #222", overflow: "hidden" }}
    >
      {/* Chat Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            {BOT_AVATAR}
            <div style={{ position: "absolute", bottom: -2, right: -2, width: "10px", height: "10px", background: "#2ecc71", borderRadius: "50%", border: "2px solid #0a0a0a" }}></div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#FFF" }}>Nike AI Stylist</div>
            <div style={{ fontSize: "12px", color: "#666" }}>En línea</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Chat Body */}
      <div className="custom-scrollbar" style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", gap: "12px", flexDirection: msg.sender === "user" ? "row-reverse" : "row" }}
            >
              {msg.sender === "user" ? USER_AVATAR : BOT_AVATAR}
              <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: "8px", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ 
                  background: msg.sender === "user" ? "#222" : "rgba(206, 255, 0, 0.05)", 
                  border: msg.sender === "user" ? "1px solid #333" : "1px solid rgba(206, 255, 0, 0.2)",
                  padding: "12px 16px", 
                  borderRadius: msg.sender === "user" ? "12px 0 12px 12px" : "0 12px 12px 12px",
                  color: msg.sender === "user" ? "#EEE" : "#FFF",
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}>
                  {msg.text}
                </div>
                {msg.product && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: "#111", border: "1px solid #333", borderRadius: "10px", padding: "12px", display: "flex", gap: "12px", alignItems: "center", width: "260px" }}
                  >
                    <img src={msg.product.img} alt={msg.product.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: "#FFF", marginBottom: "4px", lineHeight: "1.2" }}>{msg.product.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--color-volt)" }}>{msg.product.price}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: "flex", gap: "12px", flexDirection: "row" }}
            >
              {BOT_AVATAR}
              <div style={{ 
                  background: "rgba(206, 255, 0, 0.05)", 
                  border: "1px solid rgba(206, 255, 0, 0.2)",
                  padding: "12px 16px", 
                  borderRadius: "0 12px 12px 12px",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center"
                }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: "6px", height: "6px", background: "var(--color-volt)", borderRadius: "50%" }}></motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: "6px", height: "6px", background: "var(--color-volt)", borderRadius: "50%" }}></motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: "6px", height: "6px", background: "var(--color-volt)", borderRadius: "50%" }}></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #222", background: "#0a0a0a" }}>
        <form onSubmit={handleSend} style={{ display: "flex", gap: "12px" }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe tu estilo o la ocasión..."
            className="admin-input"
            style={{ flex: 1, borderRadius: "30px", padding: "12px 20px" }}
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            style={{ 
              background: input.trim() ? "var(--color-volt)" : "#333", 
              color: input.trim() ? "#000" : "#666", 
              border: "none", 
              width: "44px", 
              height: "44px", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: input.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </motion.div>
  );
}

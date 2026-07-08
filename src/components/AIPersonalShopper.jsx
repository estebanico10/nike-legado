import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { resolveAsset } from "../utils/resolveAsset";

export default function AIPersonalShopper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "¡Hola! Soy tu Nike AI Shopper. ¿Para qué usarás tus nuevas zapatillas? (ej. Correr, Lifestyle, Baloncesto)" }
  ]);
  const [input, setInput] = useState("");
  const { productos } = useProducts();

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      let botResponse = "Encontramos algunas opciones excelentes para ti.";
      let suggestions = [];

      const query = input.toLowerCase();
      if (query.includes("correr") || query.includes("running")) {
        suggestions = productos.filter(p => p.categoria === "Running").slice(0, 2);
      } else if (query.includes("baloncesto") || query.includes("basket")) {
        suggestions = productos.filter(p => p.categoria === "Baloncesto").slice(0, 2);
      } else {
        suggestions = productos.slice(0, 2);
      }

      setMessages(prev => [
        ...prev, 
        { type: "bot", text: botResponse, suggestions }
      ]);
    }, 1000);
    
    setInput("");
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "var(--space-md)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "var(--color-ink)",
          color: "var(--color-canvas)",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          cursor: "pointer",
          zIndex: 998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="AI Personal Shopper"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: "170px",
              right: "var(--space-md)",
              width: "350px",
              height: "450px",
              backgroundColor: "var(--color-canvas)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              zIndex: 998,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--color-ink-muted)"
            }}
          >
            <div style={{ backgroundColor: "var(--color-ink)", color: "var(--color-canvas)", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>Nike AI Shopper</h3>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>&times;</button>
            </div>
            
            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f9f9f9" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.type === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                  <div style={{ 
                    backgroundColor: msg.type === "user" ? "var(--color-volt)" : "white", 
                    color: msg.type === "user" ? "black" : "black",
                    padding: "10px 14px", 
                    borderRadius: "12px",
                    border: msg.type === "bot" ? "1px solid #eee" : "none",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    fontSize: "14px"
                  }}>
                    {msg.text}
                  </div>
                  
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                      {msg.suggestions.map(p => (
                        <Link to={`/producto/${p.id}`} key={p.id} onClick={() => setIsOpen(false)} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px", backgroundColor: "white", padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}>
                          <img src={resolveAsset(p.imagenes[0])} alt={p.nombre} style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }} />
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: "bold" }}>{p.nombre}</div>
                            <div style={{ fontSize: "12px", color: "gray" }}>${p.precio}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: "12px", backgroundColor: "white", borderTop: "1px solid #eee", display: "flex", gap: "8px" }}>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu mensaje..."
                style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc", outline: "none" }}
              />
              <button onClick={handleSend} style={{ background: "var(--color-ink)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

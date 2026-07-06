import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "../components/common/SEOHead";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      // Simulate login
      localStorage.setItem("nike_user", JSON.stringify({ email, name: "Esteban" }));
      navigate("/perfil");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", padding: "120px 24px 80px", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "var(--color-bg)", color: "var(--color-ink)"
    }}>
      <SEOHead title="Iniciar Sesión | Nike" description="Accede a tu cuenta Nike para ver tus pedidos y perfil." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: "450px", backgroundColor: "#0A0A0A", border: "1px solid #222", 
          borderRadius: "var(--radius-lg)", padding: "var(--space-2xl)", position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, var(--color-volt) 0%, transparent 70%)", opacity: 0.1, filter: "blur(40px)" }} />

        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style={{ marginBottom: "16px" }}>
            <path d="M24 7.8L6.4 12.2l-3.5-3L0 9.8l5.2 6.5L24 10.6V7.8z" />
          </svg>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", textTransform: "uppercase", margin: 0, color: "#F5F5F5" }}>
            Tu Cuenta Nike
          </h1>
          <p style={{ color: "#A0A0A0", fontSize: "var(--type-caption)", marginTop: "8px" }}>Inicia sesión para acceder a tus beneficios.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--type-micro)", textTransform: "uppercase", color: "#757575", marginBottom: "8px" }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" 
              required
              style={{ width: "100%", padding: "14px", backgroundColor: "#111", border: "1px solid #333", color: "#FFF", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--type-micro)", textTransform: "uppercase", color: "#757575", marginBottom: "8px" }}>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              style={{ width: "100%", padding: "14px", backgroundColor: "#111", border: "1px solid #333", color: "#FFF", borderRadius: "4px" }}
            />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "var(--type-micro)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A0A0A0" }}>
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#" style={{ color: "var(--color-volt)", textDecoration: "none" }}>¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn--volt" style={{ width: "100%", marginTop: "var(--space-md)", padding: "16px" }}>
            Iniciar Sesión
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "var(--space-lg)", fontSize: "var(--type-caption)", color: "#757575" }}>
          ¿No eres miembro? <Link to="/registro" style={{ color: "var(--color-volt)", textDecoration: "none" }}>Únete a nosotros</Link>
        </p>
      </motion.div>
    </div>
  );
}

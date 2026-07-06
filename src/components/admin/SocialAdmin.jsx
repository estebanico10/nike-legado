import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSocialStore } from "../../store/useStore";
import { compressImageToWebP } from "../../utils/imageCompression";

export default function SocialAdmin() {
  const { posts, addPost, removePost } = useSocialStore();
  const [isUploading, setIsUploading] = useState(false);
  const [link, setLink] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let finalFile = file;
      
      // Si es imagen, comprimirla
      if (file.type.startsWith("image/")) {
        finalFile = await compressImageToWebP(file, 1080, 0.85); // Resolucion óptima Instagram
      }

      // Convertir a Base64 para guardarlo en Zustand (simulando BD)
      const reader = new FileReader();
      reader.readAsDataURL(finalFile);
      reader.onloadend = () => {
        addPost({
          src: reader.result,
          type: file.type.startsWith("video/") ? "video" : "image",
          link: link || "https://instagram.com",
          date: new Date().toLocaleDateString()
        });
        setIsUploading(false);
        setLink("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
    } catch (error) {
      console.error("Error procesando archivo", error);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2xl)" }}>
        <div>
          <h2 style={{ fontSize: "var(--type-h3)", color: "#F5F5F5", marginBottom: "4px" }}>Redes Sociales</h2>
          <p style={{ color: "#A0A0A0", fontSize: "var(--type-caption)" }}>Sube el contenido de Instagram para mostrarlo en el Inicio.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-2xl)" }}>
        
        {/* Upload Section */}
        <div style={{ backgroundColor: "#111", padding: "var(--space-xl)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
          <h3 style={{ color: "#F5F5F5", marginBottom: "var(--space-md)" }}>Añadir Nueva Publicación</h3>
          
          <div style={{ marginBottom: "var(--space-md)" }}>
            <label style={{ display: "block", color: "#A0A0A0", fontSize: "var(--type-micro)", marginBottom: "8px", textTransform: "uppercase" }}>Link de Instagram (Opcional)</label>
            <input 
              type="url" 
              placeholder="https://instagram.com/p/..." 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#FFF", borderRadius: "4px" }}
            />
          </div>

          <div 
            style={{ 
              border: "2px dashed #333", borderRadius: "var(--radius-sm)", padding: "var(--space-2xl)", 
              textAlign: "center", cursor: "pointer", backgroundColor: "#1A1A1A", position: "relative"
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*,video/mp4" 
              onChange={handleFileUpload} 
              style={{ display: "none" }} 
            />
            
            {isUploading ? (
              <p style={{ color: "var(--color-volt)" }}>Optimizando y subiendo...</p>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" style={{ margin: "0 auto 12px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p style={{ color: "#F5F5F5", fontSize: "var(--type-body-sm)" }}>Haz clic para subir un archivo</p>
                <p style={{ color: "#757575", fontSize: "var(--type-micro)", marginTop: "4px" }}>Soporta JPG, PNG, WEBP, MP4</p>
              </>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div>
          <h3 style={{ color: "#F5F5F5", marginBottom: "var(--space-md)" }}>Publicaciones Activas ({posts.length})</h3>
          
          {posts.length === 0 ? (
            <div style={{ padding: "var(--space-3xl)", textAlign: "center", backgroundColor: "#111", border: "1px solid #222", borderRadius: "var(--radius-md)" }}>
              <p style={{ color: "#757575" }}>Aún no has subido ninguna publicación.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--space-md)" }}>
              {posts.map((post) => (
                <motion.div 
                  key={post.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ position: "relative", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", border: "1px solid #333" }}
                >
                  {post.type === "video" ? (
                    <video src={post.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={post.src} alt="Instagram Post" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => removePost(post.id)}
                    style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "rgba(0,0,0,0.7)", border: "1px solid #555", color: "white", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ×
                  </button>
                  
                  {/* Link indicator */}
                  {post.link && (
                    <a href={post.link} target="_blank" rel="noreferrer" style={{ position: "absolute", bottom: "8px", left: "8px", backgroundColor: "var(--color-volt)", color: "black", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", textDecoration: "none" }}>
                      Enlace
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

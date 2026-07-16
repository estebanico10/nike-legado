import { useState, useCallback } from "react";
import { optimizeImage } from "../../utils/imageOptimizer";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

// Simulated initial media gallery
const INITIAL_MEDIA = [
  { id: "img1", url: "/productos/air-max-plus-1.webp", name: "air-max-plus-1.webp", category: "productos", size: "124 KB", type: "image/webp" },
  { id: "img2", url: "/productos/dunk-low-1.jpg", name: "dunk-low-1.jpg", category: "productos", size: "210 KB", type: "image/jpeg" },
  { id: "img3", url: "/instagram/post 1.jpeg", name: "social-post-1.jpeg", category: "social", size: "340 KB", type: "image/jpeg" },
  { id: "img4", url: "/banners/hero-banner.jpg", name: "hero-banner-main.jpg", category: "banners", size: "512 KB", type: "image/jpeg" }
];

export default function MediaManagerAdmin() {
  const [media, setMedia] = useState(INITIAL_MEDIA);
  const [filterCategory, setFilterCategory] = useState("todos");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const filteredMedia = media.filter(item => filterCategory === "todos" || item.category === filterCategory);

  const processFile = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) {
      addToast("Solo se permiten archivos de imagen.", "error");
      return;
    }

    setUploading(true);
    try {
      const optimizedDataUrl = await optimizeImage(file);
      const base64str = optimizedDataUrl.split(',')[1];
      const newSizeKb = (atob(base64str).length / 1024).toFixed(1);
      
      const newMedia = {
        id: `img-${Date.now()}`,
        url: optimizedDataUrl,
        name: file.name,
        category: "productos", // Default category
        size: `${newSizeKb} KB`,
        type: file.type
      };

      setMedia(prev => [newMedia, ...prev]);
      addToast(`Imagen optimizada y subida correctamente (${newSizeKb} KB)`, "success");
    } catch {
      addToast("Error al optimizar la imagen", "error");
    } finally {
      setUploading(false);
    }
  }, [addToast]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    addToast("URL copiada al portapapeles", "success");
  };

  const deleteMedia = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta imagen? (Romperá los enlaces si está en uso)")) {
      setMedia(media.filter(m => m.id !== id));
      addToast("Imagen eliminada", "info");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Gestor de Archivos y Medios</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Sube, optimiza y organiza las imágenes de la tienda.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["todos", "productos", "banners", "social"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="btn btn--secondary"
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                border: filterCategory === cat ? "1px solid var(--color-volt)" : "1px solid #333",
                color: filterCategory === cat ? "var(--color-volt)" : "#A0A0A0",
                backgroundColor: filterCategory === cat ? "rgba(212, 255, 0, 0.05)" : "transparent"
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Uploader Dropzone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: isDragging ? "2px dashed var(--color-volt)" : "2px dashed #333",
          backgroundColor: isDragging ? "rgba(212,255,0,0.05)" : "#111",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "32px",
          transition: "all 0.3s ease",
          position: "relative"
        }}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileInput} 
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} 
        />
        {uploading ? (
          <div style={{ color: "var(--color-volt)", fontWeight: "bold" }}>Optimizando imagen...</div>
        ) : (
          <div>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: isDragging ? "var(--color-volt)" : "#757575", marginBottom: "12px" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3 style={{ color: "#FFF", fontSize: "16px", margin: "0 0 4px 0" }}>Arrastra una imagen aquí</h3>
            <p style={{ color: "#757575", fontSize: "14px", margin: 0 }}>o haz clic para explorar. Se optimizará automáticamente (WebP/JPEG).</p>
          </div>
        )}
      </div>

      {/* Media Gallery */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        <AnimatePresence>
          {filteredMedia.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#757575" }}>
              No hay imágenes en esta categoría.
            </div>
          ) : (
            filteredMedia.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div style={{ 
                  height: "140px", 
                  backgroundColor: "#222", 
                  backgroundImage: `url(${item.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderBottom: "1px solid #222"
                }} />
                
                <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <div>
                    <div style={{ color: "#FFF", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ color: "#757575", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                      <span>{item.type.split('/')[1].toUpperCase()}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => copyToClipboard(item.url)}
                      className="btn btn--secondary btn--sm" 
                      style={{ flex: 1, fontSize: "11px", padding: "4px" }}
                    >
                      Copiar URL
                    </button>
                    <button 
                      onClick={() => deleteMedia(item.id)}
                      className="btn btn--secondary btn--sm" 
                      style={{ flex: 0.5, fontSize: "11px", padding: "4px", borderColor: "rgba(211,0,5,0.3)", color: "#FF4500" }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

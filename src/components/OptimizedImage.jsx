import { useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "./Skeleton";

export default function OptimizedImage({ 
  src, 
  alt = "", 
  className = "", 
  style = {}, 
  width, 
  height, 
  objectFit = "cover" 
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className={className} 
        style={{ 
          width: width || "100%", 
          height: height || "100%", 
          backgroundColor: "var(--color-canvas-alt)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: "1px dashed var(--color-ink-muted)",
          ...style 
        }}
      >
        <span style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)" }}>
          Imagen no disponible
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: width || "100%", height: height || "100%", overflow: "hidden", ...style }} className={className}>
      {!loaded && <Skeleton width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />}
      
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit, 
          display: "block" 
        }}
      />
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import { optimizeImage } from '../../utils/imageOptimizer';
import styles from './MediaManagerAdmin.module.css';

const MediaManagerAdmin = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen.');
      return;
    }
    setError('');

    try {
      const originalSize = file.size;
      const optimizedDataUrl = await optimizeImage(file);
      
      // Calculate new size approximately
      const base64str = optimizedDataUrl.split(',')[1];
      const newSize = atob(base64str).length;
      
      const savedPercent = ((originalSize - newSize) / originalSize) * 100;

      setOptimizedImage(optimizedDataUrl);
      setStats({
        originalSize: (originalSize / 1024).toFixed(2),
        newSize: (newSize / 1024).toFixed(2),
        savedPercent: savedPercent.toFixed(2)
      });
    } catch (err) {
      console.error(err);
      setError('Error al optimizar la imagen.');
    }
  };

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
  }, []);

  const copyToClipboard = () => {
    if (optimizedImage) {
      navigator.clipboard.writeText(optimizedImage)
        .then(() => alert('Base64 copiado al portapapeles!'))
        .catch(err => console.error('Error copiando:', err));
    }
  };

  return (
    <div className={styles.mediaManagerContainer}>
      <h2>Optimizador de Imágenes (Media Manager)</h2>
      
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <p>Arrastra y suelta una imagen aquí para optimizarla, o</p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFile(e.target.files[0]);
            }
          }}
          className={styles.fileInput}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {optimizedImage && stats && (
        <div className={styles.resultContainer}>
          <div className={styles.imagePreview}>
            <h3>Vista Previa:</h3>
            <img src={optimizedImage} alt="Optimized Preview" style={{ maxWidth: '100%', maxHeight: '300px' }}/>
          </div>
          <div className={styles.stats}>
            <p><strong>Tamaño Original:</strong> {stats.originalSize} KB</p>
            <p><strong>Tamaño Optimizado:</strong> {stats.newSize} KB</p>
            <p><strong>Ahorro:</strong> {stats.savedPercent}%</p>
          </div>
          <button onClick={copyToClipboard} className={styles.copyButton}>
            Copiar Base64 Optimizado
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaManagerAdmin;

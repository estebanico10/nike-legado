import { createContext, useContext, useState, useEffect, useCallback } from "react";
import dbData from "../../db.json";

const ProductContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const defaultCategorias = [
  "Indoor Gen Z",
  "Arcade",
  "Cartografía",
  "Timeless",
  "Equipamiento",
  "Lifestyle",
  "Running",
  "Basketball",
];

// eslint-disable-next-line react-refresh/only-export-components
export const tiposProducto = [
  "gorra",
  "gorro",
  "camisa",
  "camiseta",
  "pantalón",
  "pantaloneta",
  "buzo",
  "chaqueta",
  "zapato",
];

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/productos")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProductos(data);
        } else {
          setProductos(dbData.productos || []);
        }
      })
      .catch(err => {
        console.warn("json-server offline, usando catálogo local de respaldo.", err);
        setProductos(dbData.productos || []);
      });
  }, []);

  const [categoriasState, setCategoriasState] = useState(() => {
    try {
      const saved = localStorage.getItem("nike-legado-categorias");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn("Cache info:", e); }
    return defaultCategorias;
  });
  
  const [tiposProductoState, setTiposProductoState] = useState(() => {
    try {
      const saved = localStorage.getItem("nike-legado-tipos");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn("Cache info:", e); }
    return tiposProducto; // fallback to seed
  });

  useEffect(() => {
    localStorage.setItem("nike-legado-categorias", JSON.stringify(categoriasState));
  }, [categoriasState]);

  useEffect(() => {
    localStorage.setItem("nike-legado-tipos", JSON.stringify(tiposProductoState));
  }, [tiposProductoState]);

  const addProducto = useCallback((producto) => {
    const newProducto = { ...producto, id: producto.id || crypto.randomUUID() };
    setProductos((prev) => [...prev, newProducto]);
    fetch("http://localhost:3001/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProducto)
    }).catch(e => console.warn("Error saving to db", e));
  }, []);

  const updateProducto = useCallback((id, updates) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    fetch(`http://localhost:3001/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    }).catch(e => console.warn("Error updating db", e));
  }, []);

  const removeProducto = useCallback((id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    fetch(`http://localhost:3001/productos/${id}`, {
      method: "DELETE"
    }).catch(e => console.warn("Error deleting from db", e));
  }, []);

  const getProducto = useCallback(
    (id) => productos.find((p) => p.id === id) || null,
    [productos]
  );



  const addCategoria = useCallback((cat) => {
    setCategoriasState((prev) => prev.includes(cat) ? prev : [...prev, cat]);
  }, []);

  const removeCategoria = useCallback((cat) => {
    setCategoriasState((prev) => prev.filter((c) => c !== cat));
  }, []);

  const addTipoProducto = useCallback((tipo) => {
    setTiposProductoState((prev) => prev.includes(tipo) ? prev : [...prev, tipo]);
  }, []);

  const removeTipoProducto = useCallback((tipo) => {
    setTiposProductoState((prev) => prev.filter((t) => t !== tipo));
  }, []);

  return (
    <ProductContext.Provider
      value={{
        productos, categorias: categoriasState, tiposProducto: tiposProductoState,
        addProducto, updateProducto, removeProducto, getProducto,
        addCategoria, removeCategoria, addTipoProducto, removeTipoProducto
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts debe usarse dentro de ProductProvider");
  return ctx;
}

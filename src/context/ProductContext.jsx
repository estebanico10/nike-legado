import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { productos as seedData, categorias } from "../data/database";

const STORAGE_KEY = "nike-legado-productos";
// Increment this version string whenever database.js seed data changes
// to force localStorage to reset and load fresh data.
const SEED_VERSION = "v7-indoor-genz";
const VERSION_KEY = "nike-legado-seed-version";

function loadProductos() {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== SEED_VERSION) {
      // Seed changed — wipe old cache and use fresh seed
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, SEED_VERSION);
      return seedData;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { console.warn("Cache info:", e); }
  return seedData;
}

function saveProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}

const ProductContext = createContext(null);

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
];

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState(loadProductos);
  const [categoriasState, setCategoriasState] = useState(() => {
    try {
      const saved = localStorage.getItem("nike-legado-categorias");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn("Cache info:", e); }
    return categorias; // fallback to seed
  });
  
  const [tiposProductoState, setTiposProductoState] = useState(() => {
    try {
      const saved = localStorage.getItem("nike-legado-tipos");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn("Cache info:", e); }
    return tiposProducto; // fallback to seed
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("nike-legado-cart");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn("Cache info:", e); }
    return [];
  });

  useEffect(() => {
    saveProductos(productos);
  }, [productos]);

  useEffect(() => {
    localStorage.setItem("nike-legado-categorias", JSON.stringify(categoriasState));
  }, [categoriasState]);

  useEffect(() => {
    localStorage.setItem("nike-legado-tipos", JSON.stringify(tiposProductoState));
  }, [tiposProductoState]);

  useEffect(() => {
    localStorage.setItem("nike-legado-cart", JSON.stringify(cart));
  }, [cart]);

  const addProducto = useCallback((producto) => {
    setProductos((prev) => [...prev, { ...producto, id: producto.id || crypto.randomUUID() }]);
  }, []);

  const updateProducto = useCallback((id, updates) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const removeProducto = useCallback((id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProducto = useCallback(
    (id) => productos.find((p) => p.id === id) || null,
    [productos]
  );

  const resetToSeed = useCallback(() => {
    setProductos(seedData);
  }, []);

  const addToCart = useCallback((producto, size, color) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === producto.id && item.size === size && item.color === color);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].qty += 1;
        return newCart;
      }
      return [...prev, { ...producto, size, color, qty: 1 }];
    });
  }, []);

  const updateCartQty = useCallback((index, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].qty += delta;
      if (newCart[index].qty <= 0) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

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
        productos,
        categorias: categoriasState,
        tiposProducto: tiposProductoState,
        cart,
        addProducto,
        updateProducto,
        removeProducto,
        getProducto,
        resetToSeed,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        addCategoria,
        removeCategoria,
        addTipoProducto,
        removeTipoProducto
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

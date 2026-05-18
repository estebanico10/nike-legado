export const categorias = [
  "Arcade",
  "Cartografía",
  "Timeless",
  "Equipamiento",
];

export const productos = [
  // ─── ARCADE ────────────────────────────────────────────────────────────────
  {
    id: "arcade-hoodie-001",
    nombre: "HOODIE PIXEL QUITO 16-BIT",
    tipo: "buzo",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/arcade-hoodie-001-front.webp",
      "/assets/products/arcade-hoodie-001-back.webp",
      "/assets/products/arcade-hoodie-001-detail.webp",
    ],
    descripcion:
      "Sudadera oversize con gráfico pixelado del skyline de Quito renderizado en 16-bit. Algodón heavyweight 380gsm. Costuras reforzadas. Capucha doble capa.",
    precio: 89.99,
    enOferta: false,
    esNuevo: true,
    stock: 24,
    colores: ["#111111", "#F5F5F5", "#4A6741"],
    categoria: "Arcade",
  },
  {
    id: "arcade-jacket-001",
    nombre: "CORTAVIENTO PIXEL EC",
    tipo: "chaqueta",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/arcade-jacket-001-front.webp",
      "/assets/products/arcade-jacket-001-back.webp",
      "/assets/products/arcade-jacket-001-side.webp",
      "/assets/products/arcade-jacket-001-olive.webp",
    ],
    descripcion:
      "Cortaviento técnico con gráfico pixelado del skyline de Quito en la espalda. Tejido ripstop resistente al viento. Empaque en bolsillo. Capucha ajustable y cremallera YKK.",
    precio: 119.99,
    enOferta: false,
    esNuevo: true,
    stock: 16,
    colores: ["#111111", "#4A6741"],
    categoria: "Arcade",
  },
  {
    id: "arcade-tee-andes-001",
    nombre: "TEE ANDES 8-BIT",
    tipo: "camiseta",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/arcade-hoodie-001-front.webp",   // placeholder — imagen propia pendiente
      "/assets/products/arcade-hoodie-001-back.webp",
    ],
    descripcion:
      "Camiseta de corte recto con ilustración pixelada del Volcán Cotopaxi en erupción. Paleta de 8 colores. Serigrafía en base de agua. Algodón ring-spun 200gsm.",
    precio: 49.99,
    precioOferta: 39.99,
    enOferta: true,
    esNuevo: false,
    stock: 35,
    colores: ["#111111", "#F5F5F5", "#8B7355"],
    categoria: "Arcade",
  },

  // ─── CARTOGRAFÍA ────────────────────────────────────────────────────────────
  {
    id: "carto-tee-001",
    nombre: "TEE MAPA GALÁPAGOS",
    tipo: "camiseta",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/carto-tee-001-front.webp",
      "/assets/products/carto-tee-001-back.webp",
    ],
    descripcion:
      "Camiseta de corte recto con cartografía vectorial del archipiélago de Galápagos bordada al pecho. Algodón orgánico 240gsm. Cuello reforzado sin costuras visibles.",
    precio: 54.99,
    precioOferta: 39.99,
    enOferta: true,
    esNuevo: false,
    stock: 18,
    colores: ["#FFFFFF", "#111111"],
    categoria: "Cartografía",
  },
  {
    id: "carto-longsleeve-001",
    nombre: "LONG SLEEVE AMAZONIA MAP",
    tipo: "camiseta",
    tallas: ["XS", "S", "M", "L", "XL"],
    imagenes: [
      "/assets/products/carto-longsleeve-001-front.webp",
      "/assets/products/carto-longsleeve-001-back.webp",
      "/assets/products/carto-longsleeve-001-black.webp",
    ],
    descripcion:
      "Camiseta manga larga con mapa cartográfico de la cuenca amazónica impreso en tinta de alta definición. Algodón Pima ecuatoriano 220gsm. Costuras flatlock. Puntos reflectivos en mangas.",
    precio: 64.99,
    enOferta: false,
    esNuevo: true,
    stock: 22,
    colores: ["#F5F2E8", "#111111"],
    categoria: "Cartografía",
  },
  {
    id: "carto-crewneck-001",
    nombre: "CREWNECK AMAZON ROUTE",
    tipo: "buzo",
    tallas: ["S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/carto-longsleeve-001-front.webp",   // placeholder — imagen propia pendiente
      "/assets/products/carto-longsleeve-001-back.webp",
    ],
    descripcion:
      "Crewneck heavyweight con ruta cartográfica del río Amazonas bordada en relieve. Algodón fleece 350gsm. Sin capucha. Ribetes a la vista en cuello y mangas.",
    precio: 79.99,
    enOferta: false,
    esNuevo: false,
    stock: 14,
    colores: ["#F5F2E8", "#2C3E50", "#111111"],
    categoria: "Cartografía",
  },

  // ─── TIMELESS ────────────────────────────────────────────────────────────────
  {
    id: "timeless-cap-001",
    nombre: "GORRA HERITAGE EC",
    tipo: "gorra",
    tallas: ["Talla única"],
    imagenes: [
      "/assets/products/timeless-cap-001-front.webp",
    ],
    descripcion:
      "Gorra desestructurada con bordado 'EC' en tipografía condensada. Panel frontal bajo. Cierre ajustable de tela. Algodón canvas lavado.",
    precio: 34.99,
    enOferta: false,
    esNuevo: true,
    stock: 42,
    colores: ["#111111", "#F5F5F5", "#2C3E50"],
    categoria: "Timeless",
  },
  {
    id: "timeless-jogger-001",
    nombre: "JOGGER HERITAGE LEGADO",
    tipo: "pantalón",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/timeless-jogger-001-front.webp",
      "/assets/products/timeless-jogger-001-back.webp",
      "/assets/products/timeless-jogger-001-olive.webp",
    ],
    descripcion:
      "Jogger técnico de corte cónico con logo EC bordado en muslo izquierdo. Tela tech-fleece 320gsm. Cinturilla ancha con cordón interior. Tobilleras con ribete a la vista.",
    precio: 74.99,
    enOferta: false,
    esNuevo: true,
    stock: 28,
    colores: ["#111111", "#4A6741"],
    categoria: "Timeless",
  },
  {
    id: "timeless-beanie-001",
    nombre: "BEANIE HERITAGE EC",
    tipo: "gorro",
    tallas: ["Talla única"],
    imagenes: [
      "/assets/products/timeless-cap-001-front.webp",   // placeholder — imagen propia pendiente
    ],
    descripcion:
      "Gorro de punto ribeteado con parche bordado 'EC LEGADO' en frontis. Lana merino Andina 80% / acrílico 20%. Doble capa interior para abrigo. Doblez estructurado.",
    precio: 29.99,
    enOferta: false,
    esNuevo: false,
    stock: 50,
    colores: ["#111111", "#F5F5F5", "#8B3A3A"],
    categoria: "Timeless",
  },

  // ─── EQUIPAMIENTO ────────────────────────────────────────────────────────────
  {
    id: "equip-short-001",
    nombre: "PANTALONETA TRAINING VOLT",
    tipo: "pantaloneta",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/equip-short-001-front.webp",
    ],
    descripcion:
      "Pantaloneta de entrenamiento con panel lateral reflectivo. Tela Dri-FIT 4-way stretch. Cintura elástica con cordón interno. Bolsillos laterales sellados.",
    precio: 44.99,
    enOferta: false,
    esNuevo: false,
    stock: 31,
    colores: ["#111111", "#CEFF00"],
    categoria: "Equipamiento",
  },
  {
    id: "equip-tanktop-001",
    nombre: "TANK TOP TRAINING VOLT",
    tipo: "camiseta",
    tallas: ["XS", "S", "M", "L", "XL", "XXL"],
    imagenes: [
      "/assets/products/equip-short-001-front.webp",   // placeholder — imagen propia pendiente
      "/assets/products/arcade-hoodie-001-front.webp",
    ],
    descripcion:
      "Tank top de alto rendimiento con paneles de malla ventilados en costados. Tecnología Dri-FIT que aleja la humedad. Logo EC en volt fosforescente. Corte racerback ergonómico.",
    precio: 39.99,
    enOferta: false,
    esNuevo: false,
    stock: 38,
    colores: ["#111111", "#CEFF00", "#FFFFFF"],
    categoria: "Equipamiento",
  },
  {
    id: "equip-cap-volt-001",
    nombre: "GORRA TRAINING VOLT",
    tipo: "gorra",
    tallas: ["Talla única"],
    imagenes: [
      "/assets/products/timeless-cap-001-front.webp",   // placeholder — imagen propia pendiente
    ],
    descripcion:
      "Gorra de entrenamiento en nylon ripstop volt. Visera curvada con estructura interna. Paneles de malla en coronilla para ventilación. Logo EC perforado en frontal. Cierre Velcro posterior.",
    precio: 32.99,
    precioOferta: 26.99,
    enOferta: true,
    esNuevo: false,
    stock: 25,
    colores: ["#CEFF00", "#111111"],
    categoria: "Equipamiento",
  },
];

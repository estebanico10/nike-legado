export const COLOR_PALETTE = [
  { id: "volt", name: "Volt", hex: "#CEFF00", isPremium: true, description: "Amarillo neón firma Legado (+ $10)" },
  { id: "ink", name: "Ink", hex: "#111111", isPremium: false, description: "Negro profundo mate" },
  { id: "canvas", name: "Canvas", hex: "#FFFFFF", isPremium: false, description: "Blanco puro lienzo" },
  { id: "sale-red", name: "Sale Red", hex: "#D30005", isPremium: true, description: "Rojo vibrante competición (+ $10)" },
  { id: "indoor-blue", name: "Indoor Blue", hex: "#043174", isPremium: false, description: "Azul clásico cancha" },
  { id: "orange", name: "Orange", hex: "#FF6600", isPremium: true, description: "Naranja eléctrico urbano (+ $10)" },
  { id: "dark-grey", name: "Dark Grey", hex: "#333333", isPremium: false, description: "Gris asfalto oscuro" },
  { id: "light-grey", name: "Light Grey", hex: "#E5E5E5", isPremium: false, description: "Gris neblina andina" },
  { id: "andean-leather", name: "Andean Leather", hex: "#8B4513", isPremium: true, description: "Cuero curtido tradicional (+ $10)" }
];

export const LAYERS = [
  { id: "swoosh", label: "Swoosh (Logo)", icon: "✓" },
  { id: "upper", label: "Cuerpo (Upper)", icon: "👟" },
  { id: "sole", label: "Suela (Sole)", icon: "⚡" },
  { id: "laces", label: "Cordones (Laces)", icon: "🎀" },
  { id: "heel", label: "Talón & Texto", icon: "🏷️" }
];

export function calculatePriceDetails(activeColors = {}, customText = "") {
  const basePrice = 149.99;
  const hasPremiumColor = Object.values(activeColors).some(c => c && c.isPremium);
  const premiumColorCost = hasPremiumColor ? 10.00 : 0.00;
  const customTextCost = (customText && customText.trim().length > 0) ? 15.00 : 0.00;
  const totalPrice = basePrice + premiumColorCost + customTextCost;
  return {
    basePrice,
    premiumColorCost,
    customTextCost,
    totalPrice
  };
}

export const cameraPositions = {
  general: { x: 5, y: 2.2, z: 6.2, lookAt: { x: 0, y: 0, z: 0 } },
  swoosh: { x: 4.2, y: 1.2, z: 3.8, lookAt: { x: 0, y: 0.1, z: 0 } },
  upper: { x: 3.5, y: 3.2, z: 4.5, lookAt: { x: 0, y: 0.2, z: 0 } },
  sole: { x: 0, y: -4.2, z: 3.5, lookAt: { x: 0, y: -0.2, z: 0 } },
  laces: { x: 0, y: 4.5, z: 2.2, lookAt: { x: 0, y: 0.3, z: 0 } },
  heel: { x: -4.5, y: 1.5, z: -4.2, lookAt: { x: 0, y: 0.1, z: -0.3 } },
  lateral: { x: 6.5, y: 0.8, z: 0, lookAt: { x: 0, y: 0, z: 0 } },
  top: { x: 0.05, y: 7.2, z: 0.05, lookAt: { x: 0, y: 0, z: 0 } },
  default: { x: 5, y: 2.2, z: 6.2, lookAt: { x: 0, y: 0, z: 0 } }
};

export const SHOE_MODELS = [
  {
    id: "air-force-1",
    name: "Air Force 1",
    subtitle: "'07 White/Black",
    type: "glb",
    asset: "/assets/AirForce1.glb",
    price: 189.99,
    supportsLayerColors: true,
    materialMap: {
      upper: ["Main Body Material", "Main Shoe Inside", "Insole Material", "Insole Material right"],
      swoosh: ["Logo left Material", "Logo right Material"],
      sole: "Sole Material",
      laces: "Laces Material",
      heel: ["Flap Material.002", "Tag material", "Tag materialright.001"],
    },
    scale: 0.85,
    position: [0, -0.35, 0],
    rotation: [0, 0.3, 0],
    pairBehavior: "native", // El GLB ya trae ambos zapatos
    pairConfig: { leftRegex: /left/i, rightRegex: /right/i }
  },
  {
    id: "air-jordan-1",
    name: "Air Jordan 1",
    subtitle: "Retro High OG",
    type: "glb",
    asset: "/assets/AirJordan.glb",
    price: 199.99,
    supportsLayerColors: false,
    materialMap: { upper: "DefaultMaterial" },
    scale: 1.0,
    position: [0, -0.1, 0],
    rotation: [0, -Math.PI / 2, 0],
    pairBehavior: "clone", // El GLB solo trae uno, se debe clonar para ver ambos
    pairConfig: { offset: 0.6 }
  },
  {
    id: "legado",
    name: "Nike Legado",
    subtitle: "Edición Procedural",
    type: "procedural",
    price: 149.99,
    supportsLayerColors: true,
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0.35, 0],
  }
];

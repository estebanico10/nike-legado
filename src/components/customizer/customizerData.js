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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COLOR_PALETTE as defaultColors, LAYERS as defaultLayers, SHOE_MODELS } from '../components/customizer/customizerData';

export const useCustomizerStore = create(
  persist(
    (set, get) => ({
      colors: defaultColors,
      layers: defaultLayers,
      shoeModels: SHOE_MODELS,
      pricing: {
        basePrice: 149.99,
        premiumColorSurcharge: 10.00,
        customTextSurcharge: 15.00
      },
      
      updatePricing: (newPricing) => set((state) => ({ pricing: { ...state.pricing, ...newPricing } })),
      
      addColor: (color) => set((state) => ({ colors: [...state.colors, { ...color, id: color.name.toLowerCase().replace(/\s+/g, '-') }] })),
      updateColor: (id, colorData) => set((state) => ({ colors: state.colors.map(c => c.id === id ? { ...c, ...colorData } : c) })),
      removeColor: (id) => set((state) => ({ colors: state.colors.filter(c => c.id !== id) })),
      
      calculatePrice: (activeColors = {}, customText = "", modelId = "legado") => {
        const { pricing, colors, shoeModels } = get();
        
        // Find the base price for the selected model
        const selectedModel = shoeModels.find(m => m.id === modelId) || shoeModels.find(m => m.id === "legado");
        const modelBasePrice = selectedModel ? selectedModel.price : pricing.basePrice;

        // Determine if any premium color is used
        let hasPremium = false;
        Object.values(activeColors).forEach(colorObj => {
          if (colorObj && colorObj.isPremium) hasPremium = true;
          // Fallback if colorObj doesn't have isPremium, look it up
          else if (colorObj && colorObj.id) {
            const fullColor = colors.find(c => c.id === colorObj.id);
            if (fullColor && fullColor.isPremium) hasPremium = true;
          }
        });

        const premiumColorCost = hasPremium ? pricing.premiumColorSurcharge : 0.00;
        const customTextCost = (customText && customText.trim().length > 0) ? pricing.customTextSurcharge : 0.00;
        
        return {
          basePrice: modelBasePrice,
          premiumColorCost,
          customTextCost,
          totalPrice: modelBasePrice + premiumColorCost + customTextCost
        };
      }
    }),
    {
      name: 'nike-customizer-config',
    }
  )
);

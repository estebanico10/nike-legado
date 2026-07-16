import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      faqs: [
        { id: '1', question: '¿Cuánto tarda el envío?', answer: 'Los envíos estándar toman de 3 a 5 días hábiles. Los envíos exprés 1 a 2 días hábiles.', category: 'Envíos', isActive: true },
        { id: '2', question: '¿Puedo devolver mis Nike By You?', answer: 'Los productos personalizados de Nike By You tienen una política especial de devolución de 30 días, siempre y cuando no tengan uso en exteriores.', category: 'Devoluciones', isActive: true },
        { id: '3', question: '¿Cómo uso mis puntos de lealtad?', answer: 'En el proceso de checkout, si tienes puntos suficientes, aparecerá una opción para aplicarlos como descuento en tu orden.', category: 'Club Lealtad', isActive: true }
      ],
      shippingRates: [
        { id: 'std', name: 'Estándar', price: 0, minOrderValue: 0, estimatedDays: '3-5' },
        { id: 'exp', name: 'Exprés', price: 15.00, minOrderValue: 0, estimatedDays: '1-2' }
      ],
      taxes: {
        globalRate: 16, // percentage
        includedInPrice: false
      },
      
      // FAQ Actions
      addFaq: (faq) => set((state) => ({ faqs: [...state.faqs, { ...faq, id: Date.now().toString() }] })),
      updateFaq: (id, data) => set((state) => ({ faqs: state.faqs.map(f => f.id === id ? { ...f, ...data } : f) })),
      deleteFaq: (id) => set((state) => ({ faqs: state.faqs.filter(f => f.id !== id) })),
      
      // Shipping Actions
      addShippingRate: (rate) => set((state) => ({ shippingRates: [...state.shippingRates, { ...rate, id: Date.now().toString() }] })),
      updateShippingRate: (id, data) => set((state) => ({ shippingRates: state.shippingRates.map(r => r.id === id ? { ...r, ...data } : r) })),
      deleteShippingRate: (id) => set((state) => ({ shippingRates: state.shippingRates.filter(r => r.id !== id) })),

      // Tax Actions
      updateTaxes: (data) => set((state) => ({ taxes: { ...state.taxes, ...data } }))
    }),
    {
      name: 'nike-settings-storage'
    }
  )
);

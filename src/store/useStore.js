import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isLuckyWheelOpen: false,
  openLuckyWheel: () => set({ isLuckyWheelOpen: true }),
  closeLuckyWheel: () => set({ isLuckyWheelOpen: false }),

  // Discounts won through gamification
  activeDiscount: null,
  setActiveDiscount: (discount) => set({ activeDiscount: discount }),
}));

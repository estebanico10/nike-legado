import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create((set) => ({
  isLuckyWheelOpen: false,
  openLuckyWheel: () => set({ isLuckyWheelOpen: true }),
  closeLuckyWheel: () => set({ isLuckyWheelOpen: false }),

  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  // Discounts won through gamification
  activeDiscount: null,
  setActiveDiscount: (discount) => set({ activeDiscount: discount }),
}));

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, size, quantity = 1, color = null) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id && item.size === size && item.color === color
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }
          
          return { items: [...state.items, { ...product, size, color, quantity }] };
        });
        
        // Auto-open cart when adding an item
        useUIStore.getState().openCart();
      },
      removeFromCart: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === productId && item.size === size && item.color === color)
          )
        }));
      },
      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((item) => 
            (item.id === productId && item.size === size && item.color === color)
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.enOferta && item.precioOferta ? item.precioOferta : item.precio;
          return total + (price * item.quantity);
        }, 0);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'nike-cart-storage',
    }
  )
);

export const useSocialStore = create(
  persist(
    (set) => ({
      posts: [],
      addPost: (post) => set((state) => ({ 
        posts: [{ ...post, id: Date.now().toString() }, ...state.posts] 
      })),
      removePost: (id) => set((state) => ({ 
        posts: state.posts.filter((post) => post.id !== id) 
      })),
    }),
    {
      name: 'nike-social-storage',
    }
  )
);

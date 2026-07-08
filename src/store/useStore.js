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
      couponCode: null,
      discountPercent: 0,
      applyCoupon: (code) => {
        if (code.toUpperCase() === "NIKE10") {
          set({ couponCode: "NIKE10", discountPercent: 10 });
          return { success: true, message: "Cupón aplicado: 10% OFF" };
        }
        if (code.toUpperCase() === "LEGADO20") {
          set({ couponCode: "LEGADO20", discountPercent: 20 });
          return { success: true, message: "Cupón aplicado: 20% OFF" };
        }
        return { success: false, message: "Cupón inválido o expirado" };
      },
      removeCoupon: () => set({ couponCode: null, discountPercent: 0 }),
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

const defaultSocialPosts = [
  { id: '1', src: '/instagram/post 1.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() },
  { id: '2', src: '/instagram/post 2.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() },
  { id: '3', src: '/instagram/post 3.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() },
  { id: '4', src: '/instagram/post 4.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() },
  { id: '5', src: '/instagram/post 5.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() },
  { id: '6', src: '/instagram/post 6.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() },
  { id: '7', src: '/instagram/post 7.jpeg', type: 'image', link: 'https://www.instagram.com/adnp.asion?igsh=NWhicWUwbmptZnE1&utm', date: new Date().toLocaleDateString() }
];

export const useSocialStore = create(
  persist(
    (set) => ({
      posts: defaultSocialPosts,
      addPost: (post) => set((state) => ({ 
        posts: [{ ...post, id: Date.now().toString() }, ...state.posts] 
      })),
      removePost: (id) => set((state) => ({ 
        posts: state.posts.filter((post) => post.id !== id) 
      })),
    }),
    {
      name: 'nike-social-storage-v2',
    }
  )
);

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const items = get().items;
        const exists = items.some(item => item.id === product.id);
        if (exists) {
          set({ items: items.filter(item => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      isInWishlist: (id) => get().items.some(item => item.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'nike-wishlist-storage',
    }
  )
);

export const useThemeStore = create(
  persist(
    (set) => ({
      accentColor: "#D4FF00",
      setAccentColor: (color) => {
        set({ accentColor: color });
        document.documentElement.style.setProperty('--color-volt', color);
      }
    }),
    {
      name: 'nike-theme-storage',
    }
  )
);

export const useRecentStore = create(
  persist(
    (set) => ({
      recentProducts: [],
      addRecentProduct: (product) => {
        set((state) => {
          const exists = state.recentProducts.find(p => p.id === product.id);
          if (exists) return state;
          const updated = [product, ...state.recentProducts].slice(0, 8);
          return { recentProducts: updated };
        });
      },
    }),
    {
      name: 'nike-recent-storage',
    }
  )
);

export const useUserStore = create(
  persist(
    (set) => ({
      user: {
        name: "Carlos",
        email: "carlos@example.com",
        coins: 1250, // Initial coins for demo
      },
      addCoins: (amount) => set((state) => ({ user: { ...state.user, coins: state.user.coins + amount } })),
      redeemCoins: (amount) => set((state) => ({ user: { ...state.user, coins: Math.max(0, state.user.coins - amount) } })),
    }),
    {
      name: 'nike-user-storage',
    }
  )
);

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: [
        { id: "MX-8930", customerName: "Carlos Gómez", customerEmail: "carlos@example.com", date: "12 May, 2026", status: "Entregado", total: 3499, items: [{ nombre: "Nike Air Max Pulse", quantity: 1, precio: 3499 }] },
        { id: "MX-7621", customerName: "Esteban López", customerEmail: "esteban@example.com", date: "04 Abr, 2026", status: "Procesando", total: 2899, items: [{ nombre: "Nike Dunk Low", quantity: 1, precio: 2899 }] },
      ],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(order => order.id === orderId ? { ...order, status } : order)
      })),
    }),
    { name: 'nike-orders-storage' }
  )
);

export const useCustomerStore = create(
  persist(
    (set) => ({
      customers: [
        { id: "CUST-001", name: "Carlos Gómez", email: "carlos@example.com", tier: "Gold", spent: 6398, ordersCount: 2, status: "Activo" },
        { id: "CUST-002", name: "Sofía Martínez", email: "sofia.m@example.com", tier: "Silver", spent: 2899, ordersCount: 1, status: "Activo" },
        { id: "CUST-003", name: "Alejandro Pérez", email: "ale.perez@example.com", tier: "Standard", spent: 0, ordersCount: 0, status: "Suspendido" },
      ],
      addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
      toggleCustomerStatus: (id) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, status: c.status === "Activo" ? "Suspendido" : "Activo" } : c)
      })),
    }),
    { name: 'nike-customers-storage' }
  )
);

export const useReviewsStore = create(
  persist(
    (set) => ({
      reviews: [
        { id: "REV-001", productName: "Nike Air Max Pulse", customerName: "Carlos Gómez", rating: 5, comment: "Excelente calzado, muy cómodos y el estilo es insuperable.", date: "15 May, 2026", approved: true },
        { id: "REV-002", productName: "Nike Dunk Low", customerName: "Sofía Martínez", rating: 4, comment: "Buen producto, pero la entrega tardó dos días más de lo previsto.", date: "10 May, 2026", approved: false },
        { id: "REV-003", productName: "Nike Pegasus 40", customerName: "Roberto D.", rating: 5, comment: "Increíbles para correr maratones. El rebote de la suela es perfecto.", date: "02 May, 2026", approved: true },
      ],
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      approveReview: (id) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, approved: true } : r)
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id)
      })),
    }),
    { name: 'nike-reviews-storage' }
  )
);

export const useCompareStore = create(
  persist(
    (set, get) => ({
      compareItems: [],
      toggleCompare: (product) => {
        const items = get().compareItems;
        const exists = items.some(item => item.id === product.id);
        if (exists) {
          set({ compareItems: items.filter(item => item.id !== product.id) });
        } else if (items.length < 3) {
          set({ compareItems: [...items, product] });
        }
      },
      removeFromCompare: (id) => {
        set({ compareItems: get().compareItems.filter(item => item.id !== id) });
      },
      clearCompare: () => set({ compareItems: [] }),
    }),
    { name: 'nike-compare-storage' }
  )
);

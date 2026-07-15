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
        // Award loyalty points
        if (typeof useLoyaltyStore !== 'undefined' && useLoyaltyStore.getState) {
          useLoyaltyStore.getState()?.addPoints?.(50, `Añadir al carrito (${product?.nombre || 'Producto'})`);
        }
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

export const useCouponStore = create(
  persist(
    (set) => ({
      coupons: [
        { id: "1", code: "NIKE10", discountPercent: 10, active: true, expiresAt: "2026-12-31" },
        { id: "2", code: "LEGADO20", discountPercent: 20, active: true, expiresAt: "2026-12-31" }
      ],
      addCoupon: (coupon) => set((state) => ({ coupons: [...state.coupons, { ...coupon, id: Date.now().toString() }] })),
      updateCoupon: (id, updates) => set((state) => ({
        coupons: state.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCoupon: (id) => set((state) => ({
        coupons: state.coupons.filter(c => c.id !== id)
      }))
    }),
    { name: 'nike-coupon-storage' }
  )
);

export const useBannerStore = create(
  persist(
    (set) => ({
      banners: [
        { id: "1", title: "Lanzamiento Exclusivo", subtitle: "Nueva Colección Barrio", imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=1000", linkTo: "/tienda", active: true }
      ],
      addBanner: (banner) => set((state) => ({ banners: [...state.banners, { ...banner, id: Date.now().toString() }] })),
      updateBanner: (id, updates) => set((state) => ({
        banners: state.banners.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBanner: (id) => set((state) => ({
        banners: state.banners.filter(b => b.id !== id)
      }))
    }),
    { name: 'nike-banner-storage' }
  )
);

export const useCommunityStore = create(
  persist(
    (set) => ({
      posts: [
        {
          id: "OOTD-001",
          author: "@esteban_snkrs",
          location: "Quito — UNEMI Campus",
          shoe: "Nike Air Max Pulse Barrio",
          description: "Estilo universitario cómodo para largos días de clases y exposición de proyectos. Neón Volt a tope 🔥",
          imageUrl: "/instagram/post 1.jpeg",
          likes: 48,
          likedByMe: false,
          category: "Air Max",
          featured: true,
          approved: true,
          comments: [
            { id: "c1", author: "@sofia.m", text: "¡Qué flow con ese neón!", date: "Hace 2h" },
            { id: "c2", author: "@carlos_zapatillas", text: "Las Air Max Barrio son otro nivel 👑", date: "Hace 1h" }
          ]
        },
        {
          id: "OOTD-002",
          author: "@valeria_dunk",
          location: "Guayaquil — Centro Histórico",
          shoe: "Nike Dunk High Inca Heritage",
          description: "Combinando texturas andinas y cuero premium en la calle. Orgullo e identidad en cada paso.",
          imageUrl: "/instagram/post 2.jpeg",
          likes: 62,
          likedByMe: false,
          category: "Dunks",
          featured: true,
          approved: true,
          comments: [
            { id: "c3", author: "@mateo_run", text: "¡Estilazo! La combinación de tonos tierra es espectacular.", date: "Hace 3h" }
          ]
        },
        {
          id: "OOTD-003",
          author: "@leo_speed",
          location: "Cuenca — Río Tomebamba",
          shoe: "Nike Pegasus 40 Electric",
          description: "Entrenamiento matutino por la ciudad con máxima amortiguación y velocidad. Listo para la maratón.",
          imageUrl: "/instagram/post 3.jpeg",
          likes: 31,
          likedByMe: false,
          category: "Running",
          featured: false,
          approved: true,
          comments: []
        },
        {
          id: "OOTD-004",
          author: "@andrea_air",
          location: "Medellín — El Poblado",
          shoe: "Nike Air Max 90 Infrared Heritage",
          description: "Un clásico eterno del streetwear. Look casual con jeans anchos y chaqueta cortavientos Volt.",
          imageUrl: "/instagram/post 4.jpeg",
          likes: 89,
          likedByMe: false,
          category: "Air Max",
          featured: true,
          approved: true,
          comments: [
            { id: "c4", author: "@danny_snkrs", text: "Las 90 siempre serán las reinas de la calle.", date: "Hace 5h" },
            { id: "c5", author: "@esteban_snkrs", text: "¡Tremendo match de colores!", date: "Hace 4h" }
          ]
        },
        {
          id: "OOTD-005",
          author: "@camila_dunks",
          location: "CDMX — Roma Norte",
          shoe: "Nike Dunk Low Retro Panda",
          description: "Minimalismo monocromático perfecto para recorrer galerías y cafeterías en la ciudad.",
          imageUrl: "/instagram/post 5.jpeg",
          likes: 104,
          likedByMe: false,
          category: "Dunks",
          featured: false,
          approved: true,
          comments: [
            { id: "c6", author: "@valeria_dunk", text: "El panda nunca falla 🔥", date: "Hace 6h" }
          ]
        },
        {
          id: "OOTD-006",
          author: "@runner_santi",
          location: "Bogotá — Parque Simón Bolívar",
          shoe: "Nike Vaporfly 3 Volt",
          description: "Ritmo de competencia en altura. La fibra de carbono se siente desde la primera zancada 🏃‍♂️⚡",
          imageUrl: "/instagram/post 6.jpeg",
          likes: 45,
          likedByMe: false,
          category: "Running",
          featured: false,
          approved: true,
          comments: []
        },
        {
          id: "OOTD-007",
          author: "@newbie_street",
          location: "Quito — La Mariscal",
          shoe: "Nike Air Force 1 '07 Pure",
          description: "Probando mis nuevas AF1 blancas. El básico indispensable en el armario.",
          imageUrl: "/instagram/post 7.jpeg",
          likes: 12,
          likedByMe: false,
          category: "Todos",
          featured: false,
          approved: false,
          comments: []
        }
      ],
      addPost: (newPost) => set((state) => ({
        posts: [
          {
            id: `OOTD-${Date.now()}`,
            likes: 1,
            likedByMe: true,
            featured: false,
            approved: true,
            comments: [],
            category: "Todos",
            ...newPost
          },
          ...state.posts
        ]
      })),
      toggleLike: (id) => set((state) => ({
        posts: state.posts.map(p => {
          if (p.id !== id) return p;
          const newLikedByMe = !p.likedByMe;
          return {
            ...p,
            likedByMe: newLikedByMe,
            likes: newLikedByMe ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        })
      })),
      addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map(p => p.id === postId ? {
          ...p,
          comments: [...p.comments, { id: `c-${Date.now()}`, ...comment }]
        } : p)
      })),
      toggleFeatured: (id) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, featured: !p.featured } : p)
      })),
      toggleApprove: (id) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, approved: p.approved === false ? true : false } : p)
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(p => p.id !== id)
      }))
    }),
    { name: 'nike-community-storage' }
  )
);

export const defaultThresholds = {
  rookie: 0,
  sneakerhead: 500,
  vip: 1500
};

export const defaultBadgesCatalog = [
  {
    id: "rookie",
    icon: "🌱",
    title: "Rookie del Barrio",
    description: "Bienvenido al Club Nike Legado. Has iniciado tu camino en el Street Cred ganando tus primeros puntos.",
    condition: "0 Puntos Street Cred"
  },
  {
    id: "sneakerhead",
    icon: "👟",
    title: "Sneakerhead Oficial",
    description: "Has alcanzado o superado el umbral de 500 Puntos Street Cred demostrando tu pasión por el calzado.",
    condition: "500 Puntos Street Cred"
  },
  {
    id: "vip_legado",
    icon: "👑",
    title: "VIP Legado",
    description: "La cúspide del Street Cred. Has superado los 1,500 Puntos y eres parte de la realeza callejera de Nike.",
    condition: "1,500 Puntos Street Cred"
  },
  {
    id: "community_star",
    icon: "🌟",
    title: "Estrella del Muro",
    description: "Has destacado compartiendo tus mejores outfits y estilo urbano en el Muro de Comunidad.",
    condition: "Publicar en el Muro OOTD"
  },
  {
    id: "custom_designer",
    icon: "🎨",
    title: "Diseñador Custom 3D",
    description: "Exploraste y personalizaste tu propio par legendario en nuestro laboratorio interactivo 3D.",
    condition: "Crear en Customizer 3D"
  }
];

export const defaultRewards = [
  {
    id: "REW-15OFF",
    title: "$15 OFF en tu compra",
    description: "Cupón de descuento directo de $15 USD aplicable en cualquier orden de calzado o ropa streetwear.",
    cost: 200,
    isCoupon: true,
    couponCode: "STREET15",
    discountPercent: 15,
    icon: "🏷️"
  },
  {
    id: "REW-LACES",
    title: "Cordones Neón Volt Gratis",
    description: "Pack exclusivo de cordones fosforescentes Neón Volt edición especial para tunear tus zapatillas.",
    cost: 400,
    isCoupon: false,
    icon: "⚡"
  },
  {
    id: "REW-VIPDROP",
    title: "Acceso VIP Anticipado a Drops",
    description: "Pase prioritario 24 horas antes del lanzamiento público para asegurar tu par en los drops más codiciados.",
    cost: 600,
    isCoupon: false,
    icon: "👑"
  },
  {
    id: "REW-20OFF",
    title: "Cupón 20% OFF LEGADO20",
    description: "Descuento especial del 20% en todo el catálogo de Nike Legado sin monto mínimo de compra.",
    cost: 800,
    isCoupon: true,
    couponCode: "LEGADO20",
    discountPercent: 20,
    icon: "🔥"
  }
];

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      points: 350,
      level: "Rookie",
      badges: ["rookie"],
      thresholds: defaultThresholds,
      badgesCatalog: defaultBadgesCatalog,
      rewards: defaultRewards,
      history: [
        { id: "H1", action: "Bienvenida al Club Nike Legado", points: 250, date: "12 Jul, 2026" },
        { id: "H2", action: "Exploración inicial en Tienda", points: 100, date: "13 Jul, 2026" }
      ],
      addPoints: (amount, actionName) => set((state) => {
        const newPoints = state.points + amount;
        const thresh = state.thresholds || defaultThresholds;
        let newLevel = "Rookie";
        if (newPoints >= (thresh.vip || 1500)) newLevel = "VIP Legado";
        else if (newPoints >= (thresh.sneakerhead || 500)) newLevel = "Sneakerhead";

        const newBadges = [...(state.badges || [])];
        if (newPoints >= (thresh.sneakerhead || 500) && !newBadges.includes("sneakerhead")) newBadges.push("sneakerhead");
        if (newPoints >= (thresh.vip || 1500) && !newBadges.includes("vip_legado")) newBadges.push("vip_legado");
        if (actionName.toLowerCase().includes("muro") && !newBadges.includes("community_star")) newBadges.push("community_star");
        if (actionName.toLowerCase().includes("custom") && !newBadges.includes("custom_designer")) newBadges.push("custom_designer");

        return {
          points: newPoints,
          level: newLevel,
          badges: newBadges,
          history: [
            { id: `H-${Date.now()}-${Math.random().toString(36).substr(2,4)}`, action: actionName, points: amount, date: "Hoy" },
            ...(state.history || [])
          ]
        };
      }),
      redeemReward: (rewardId, cost) => {
        const currentPoints = get().points;
        if (currentPoints < cost) return { success: false, message: "Puntos Street Cred insuficientes" };
        
        set((state) => {
          const newPoints = state.points - cost;
          const thresh = state.thresholds || defaultThresholds;
          let newLevel = "Rookie";
          if (newPoints >= (thresh.vip || 1500)) newLevel = "VIP Legado";
          else if (newPoints >= (thresh.sneakerhead || 500)) newLevel = "Sneakerhead";

          return {
            points: newPoints,
            level: newLevel,
            history: [
              { id: `H-${Date.now()}-${Math.random().toString(36).substr(2,4)}`, action: `Canje de Recompensa (${rewardId})`, points: -cost, date: "Hoy" },
              ...(state.history || [])
            ]
          };
        });
        return { success: true, message: "Recompensa canjeada con éxito" };
      },
      updateThresholds: (newThresholds) => set((state) => {
        const currentPoints = state.points;
        let newLevel = "Rookie";
        if (currentPoints >= (newThresholds.vip || 1500)) newLevel = "VIP Legado";
        else if (currentPoints >= (newThresholds.sneakerhead || 500)) newLevel = "Sneakerhead";

        const newBadges = [...(state.badges || [])];
        if (currentPoints >= (newThresholds.sneakerhead || 500) && !newBadges.includes("sneakerhead")) newBadges.push("sneakerhead");
        if (currentPoints >= (newThresholds.vip || 1500) && !newBadges.includes("vip_legado")) newBadges.push("vip_legado");

        return {
          thresholds: newThresholds,
          level: newLevel,
          badges: newBadges
        };
      }),
      awardBonus: (userIdentifier, amount, reason) => {
        get().addPoints(amount, `Bono Admin: ${reason} (${userIdentifier})`);
        return { success: true, message: `Bono de ${amount} PTS otorgado a ${userIdentifier}` };
      },
      addReward: (reward) => set((state) => ({
        rewards: [...(state.rewards || defaultRewards), { ...reward, id: `REW-${Date.now()}` }]
      })),
      updateReward: (id, updates) => set((state) => ({
        rewards: (state.rewards || defaultRewards).map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteReward: (id) => set((state) => ({
        rewards: (state.rewards || defaultRewards).filter(r => r.id !== id)
      }))
    }),
    { name: 'nike-loyalty-storage' }
  )
);


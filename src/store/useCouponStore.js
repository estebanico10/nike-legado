import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default initial coupons
const initialCoupons = [
  {
    id: "NIKE10",
    code: "NIKE10",
    type: "percentage",
    value: 10,
    status: "active",
    usageLimit: 100,
    usageCount: 45,
    minAmount: 0,
    expiryDate: "2027-12-31",
    description: "10% de descuento en toda la tienda"
  },
  {
    id: "LEGADO20",
    code: "LEGADO20",
    type: "percentage",
    value: 20,
    status: "active",
    usageLimit: 50,
    usageCount: 12,
    minAmount: 150,
    expiryDate: "2027-12-31",
    description: "20% de descuento en compras sobre $150"
  },
  {
    id: "FREESHIP",
    code: "FREESHIP",
    type: "freeshipping",
    value: 0,
    status: "active",
    usageLimit: 500,
    usageCount: 320,
    minAmount: 100,
    expiryDate: "2027-12-31",
    description: "Envío gratis en compras sobre $100"
  }
];

export const useCouponStore = create(
  persist(
    (set, get) => ({
      coupons: initialCoupons,

      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [{ ...coupon, id: coupon.code, usageCount: 0 }, ...state.coupons],
        })),

      updateCoupon: (id, updatedData) =>
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
        })),

      deleteCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        })),

      toggleCouponStatus: (id) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
          ),
        })),

      validateCoupon: (code, cartTotal) => {
        const { coupons } = get();
        const coupon = coupons.find((c) => c.code === code);

        if (!coupon) return { valid: false, message: "Cupón no encontrado." };
        if (coupon.status !== "active") return { valid: false, message: "Este cupón está inactivo." };
        if (new Date(coupon.expiryDate) < new Date()) return { valid: false, message: "Este cupón ha expirado." };
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) return { valid: false, message: "El cupón ha alcanzado su límite de usos." };
        if (cartTotal < coupon.minAmount) return { valid: false, message: `Compra mínima de $${coupon.minAmount} requerida.` };

        return { valid: true, coupon };
      },
      
      incrementUsage: (code) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, usageCount: (c.usageCount || 0) + 1 } : c
          ),
        })),
    }),
    {
      name: 'nike-coupons-storage',
    }
  )
);

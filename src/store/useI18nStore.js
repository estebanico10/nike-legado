import { create } from "zustand";
import { persist } from "zustand/middleware";

const exchangeRates = {
  USD: 1,
  MXN: 18.5,
  EUR: 0.92
};

export const useI18nStore = create(
  persist(
    (set, get) => ({
      currency: "USD",
      lang: "es",
      setCurrency: (currency) => set({ currency }),
      setLang: (lang) => set({ lang }),
      
      formatPrice: (priceInUSD) => {
        const { currency } = get();
        const rate = exchangeRates[currency] || 1;
        const converted = priceInUSD * rate;
        
        return new Intl.NumberFormat(get().lang === "es" ? "es-MX" : "en-US", {
          style: "currency",
          currency: currency
        }).format(converted);
      }
    }),
    {
      name: "nike-legado-i18n"
    }
  )
);

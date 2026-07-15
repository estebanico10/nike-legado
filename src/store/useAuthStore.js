import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const rolePermissions = {
  'Super Admin': ['all'],
  'Analista': ['inventario', 'ventas', 'pedidos', 'clientes', 'metricas'],
  'Moderador': ['comunidad', 'resenas', 'social', 'fidelidad', 'inicio', 'presentacion', 'equipo', 'marketing', 'drops']
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      login: (user, role) => set({ user, role }),
      logout: () => set({ user: null, role: null }),
      canAccess: (tabId) => {
        const { role } = get();
        if (!role) return false;
        if (role === 'Super Admin') return true;
        return rolePermissions[role]?.includes(tabId) || false;
      }
    }),
    {
      name: 'nike-auth-storage'
    }
  )
);

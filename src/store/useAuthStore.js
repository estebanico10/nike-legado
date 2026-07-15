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
      error: null,
      login: (username, password) => {
        if (username === 'estebanico10' && password === 'JesusesVida.10') {
          set({ user: { name: 'Esteban David' }, role: 'Super Admin', error: null });
          return true;
        } else {
          set({ error: 'Credenciales incorrectas' });
          return false;
        }
      },
      clearError: () => set({ error: null }),
      logout: () => set({ user: null, role: null, error: null }),
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

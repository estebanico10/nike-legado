import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuditStore } from './useAuditStore';

const rolePermissions = {
  'Super Admin': ['all'],
  'Analista': ['inventario', 'ventas', 'pedidos', 'clientes', 'metricas', 'cupones'],
  'Moderador': ['comunidad', 'resenas', 'social', 'fidelidad', 'inicio', 'presentacion', 'equipo', 'marketing', 'drops', 'cupones', 'customizer', 'faq', 'shipping', 'builder']
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
          useAuditStore.getState().addLog('Login exitoso', username, 'Acceso al panel de administración', 'info');
          return true;
        } else {
          set({ error: 'Credenciales incorrectas' });
          useAuditStore.getState().addLog('Login fallido', username || 'Desconocido', 'Intento de acceso con credenciales incorrectas', 'warning');
          return false;
        }
      },
      clearError: () => set({ error: null }),
      logout: () => {
        const user = get().user;
        if (user) useAuditStore.getState().addLog('Cierre de sesión', user.name, 'Sesión finalizada', 'info');
        set({ user: null, role: null, error: null });
      },
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

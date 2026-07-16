import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePageBuilderStore = create(
  persist(
    (set) => ({
      sections: [
        { id: 'hero', name: 'Hero Banner Principal', isVisible: true, order: 1, title: 'JUST DO IT', subtitle: 'Nike Air Max Series' },
        { id: 'featured', name: 'Colección Destacada', isVisible: true, order: 2, title: 'Nuevos Lanzamientos', subtitle: 'Descubre la última tecnología' },
        { id: 'customizer', name: 'Banner Customizer (Nike By You)', isVisible: true, order: 3, title: 'Hazlo Tuyo', subtitle: 'Personaliza cada detalle' },
        { id: 'categories', name: 'Navegación por Categorías', isVisible: true, order: 4, title: 'Comprar por Deporte', subtitle: '' },
        { id: 'newsletter', name: 'Suscripción Newsletter', isVisible: true, order: 5, title: 'Únete a la Comunidad', subtitle: 'Recibe noticias y ofertas exclusivas' }
      ],
      
      toggleSection: (id) => set((state) => ({
        sections: state.sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s)
      })),
      
      updateSection: (id, data) => set((state) => ({
        sections: state.sections.map(s => s.id === id ? { ...s, ...data } : s)
      })),
      
      reorderSections: (newOrderArray) => set(() => ({
        sections: newOrderArray
      }))
    }),
    {
      name: 'nike-pagebuilder-storage'
    }
  )
);

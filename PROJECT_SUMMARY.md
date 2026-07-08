# Resumen del Proyecto Nike Legado E-Commerce

Este documento contiene un resumen detallado de todas las funcionalidades, componentes y arquitectura del proyecto de E-Commerce (clon/concepto premium de Nike).

## 🚀 Arquitectura y Tecnologías
- **Framework:** React (Vite)
- **Enrutamiento:** React Router DOM (HashRouter)
- **Gestión de Estado:** Zustand (con middleware `persist` para almacenamiento local)
- **Animaciones:** Framer Motion y GSAP (efectos fluidos, scroll, transiciones de página, layout animations)
- **3D:** React Three Fiber (`@react-three/fiber`, `@react-three/drei`) para visualización y configuración de zapatillas en 3D.
- **Estilos:** CSS puro enfocado en variables (Design Tokens), Glassmorphism, y un diseño "Premium/Espacial" de alto contraste (Dark mode por defecto con acentos color Volt).
- **Iconografía:** SVGs inline y lucide-react (opcional).

## 🧩 Estructura del Estado (Zustand)
El estado de la aplicación está unificado y persistido localmente:
- **`useUIStore`:** Controla modales (Carrito, Búsqueda, Ruleta de la suerte, Descuentos activos).
- **`useCartStore`:** Lógica del carrito de compras, cálculo de totales, cupones de descuento ("NIKE10", "LEGADO20").
- **`useWishlistStore`:** Gestión de productos favoritos.
- **`useCompareStore`:** Lógica para comparar hasta 3 productos simultáneamente.
- **`useRecentStore`:** Historial de productos vistos recientemente (hasta 8).
- **`useThemeStore`:** Gestión del color de acento (`--color-volt`) personalizable por el usuario.
- **`useUserStore` / `useOrderStore` / `useCustomerStore` / `useReviewsStore`:** Datos simulados (mocks) para usuarios, pedidos, clientes y reseñas, utilizados para el Dashboard de Administración y flujo de compras.

## 📱 Páginas y Secciones Principales

### 1. Inicio (`/`)
- **HeroSection:** Video de fondo impactante con tipografía dinámica y botones magnéticos.
- **NewsTicker & StatsCounter:** Cinta de noticias en movimiento y contadores numéricos animados.
- **LookbookSection:** Galería con efecto Parallax en las imágenes.
- **DropsCalendar:** Calendario interactivo de próximos lanzamientos exclusivos (Sneakers) con opción de recordatorio.
- **ShopTheLook:** Interfaz para comprar un "outfit" completo directamente desde una fotografía.
- **InstagramFeed:** Integración visual simulada del feed de redes sociales.
- **TestimonialsSection & CTASection:** Reseñas destacadas y llamado a la acción final.

### 2. Tienda (`/tienda`)
- Catálogo completo de productos con filtros por categoría, talla, color y precio.
- **SearchOverlay:** Búsqueda predictiva a pantalla completa que sugiere autocompletado y muestra resultados dinámicos con imágenes.
- Tarjetas de producto (`ProductCard`) con efectos 3D tilt, botones de vista rápida ("Quick View") y botón "Comparar".
- **CompareDrawer:** Panel inferior deslizable para comparar lado a lado las especificaciones de hasta 3 productos elegidos.

### 3. Página de Producto (`/producto/:id`)
- Galería de imágenes fluida con transiciones `layoutId`.
- **Fit Predictor (SizeRecommender):** Recomendador de tallas inteligente que pide tu talla en otra marca (ej. Adidas) para sugerir tu talla ideal en Nike.
- **Bundle Builder (Creador de Conjuntos):** Interfaz para elegir una prenda superior, inferior y zapatillas; calculando automáticamente un 15% de descuento al llevar las tres.
- **InteractiveShoe3D & ProductConfigurator3D:** Un modelo 3D manipulable (zoom, rotación) de la zapatilla, con la posibilidad de personalizar colores de distintas partes (Suela, Cordones, Cuerpo) estilo "Nike By You".
- **CustomerReviews:** Sistema de reseñas por estrellas con filtrado.

### 4. Funcionalidades Globales ("Quality of Life")
- **CartDrawer:** Carrito lateral con cálculo de envío gratis, cupones y resumen de compra.
- **AIPersonalShopper:** Un bot asistente estilo chat, flotante en la esquina inferior, que recomienda productos según tus mensajes (ej. "Quiero zapatillas para correr").
- **LuckyWheel:** Ruleta de la suerte gamificada que aparece en ciertas condiciones para que el usuario gane un código de descuento.
- **ExitIntentPopup:** Modal de retención que aparece cuando el usuario mueve el ratón fuera de la ventana con intención de irse.
- **WhatsAppFAB:** Botón flotante para asistencia vía WhatsApp.

### 5. Dashboard de Administración (`/admin`)
- Panel protegido para gestionar el e-commerce.
- **AnalyticsMetrics:** KPIs reales (Ingresos totales, ticket promedio, conversión) alimentados desde el store de pedidos de Zustand.
- **InventoryTable:** CRUD completo para agregar, editar o eliminar productos del catálogo.

## 🛠 Próximos Pasos (En Desarrollo)
El sistema ya cuenta con funcionalidades premium, las siguientes propuestas llevarían el e-commerce al tope de innovación:
- **Flujo de Checkout (`/checkout`):** Multi-paso (Envío, Pago, Confirmación) con integraciones visuales de tarjetas.
- **Perfil de Usuario (`/perfil`):** Historial de pedidos, Programa de Lealtad (monedas/puntos acumulables).
- **Prueba en Realidad Aumentada (AR Mock):** Simulación de ver la zapatilla en tu espacio utilizando la cámara.

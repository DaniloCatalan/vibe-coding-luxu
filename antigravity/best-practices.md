# Mejores Prácticas para Aplicaciones de Bienes Raíces (Real Estate) en Next.js

## 🚀 Rendimiento y Optimización
*   **Optimización de Imágenes:** Utiliza siempre el componente `<Image />` de Next.js. Las propiedades inmobiliarias dependen enormemente del impacto visual. Configura formatos modernos como WebP/AVIF y establece adecuadamente los atributos `sizes`, y sobre todo, usa `priority` para la imagen principal de las propiedades para mejorar el LCP (Largest Contentful Paint).
*   **Carga Diferida (Lazy Loading):** Implementa lazy loading para componentes pesados y no críticos en la carga inicial, como mapas interactivos o tours virtuales 3D (`next/dynamic`).
*   **Prevención de CLS:** Mantén un monitoreo estricto sobre el CLS (Cumulative Layout Shift). Reserva los espacios para las imágenes y evita saltos de contenido mientras los usuarios navegan la galería fotográfica de una casa.

## 🔍 SEO (Search Engine Optimization)
*   **Metadatos Dinámicos:** Aprovecha la API de metadatos de App Router (`generateMetadata`) para generar de forma dinámica `titles`, `descriptions` y etiquetas Open Graph por cada propiedad basándote en su ubicación, tipo y precio.
*   **Sitemaps Actualizados:** Genera un `sitemap.xml` dinámico. El inventario inmobiliario fluctúa; los buscadores deben tener siempre las propiedades activas más recientes.
*   **Datos Estructurados (Schema.org):** Implementa JSON-LD utilizando `RealEstateListing`, `SingleFamilyResidence`, o esquemas de `Offer` para habilitar *Rich Snippets* en los resultados de búsqueda.
*   **Manejo de URLs:** Utiliza slugs amigables, descriptivos y consistentes. Ejemplo: `/propiedades/departamento-de-lujo-en-vitacura`. Usa los *Search Params* (URL Query) para el estado de las búsquedas para permitir enlaces compartibles a resultados específicos (ej. `/buscar?habitaciones=3&precioMax=500000`).

## 🎨 Diseño UI/UX y Estética Premium
*   **Sensación de Lujo:** Especialmente para aplicaciones "Luxe", escoge una paleta equilibrada de colores neutrales acompañados de una buena selección tipográfica (ej. inter, outfit) y evita diseños sobrecargados.
*   **Microinteracciones:** Acentúa la navegación con transiciones al hacer hover sobre las *Property Cards*, paralaje sutil (parallax) en el scroll o *fade-ins* al entrar contenido al puerto de visión (viewport) para hacerlo inmersivo.
*   **Filtros Superiores:** El componente más crítico de un sistema de propiedades es el buscador. Diseña un sistema de filtrado intuitivo pero poderoso que no recargue inmediatamente toda la página.

## 🗄️ Arquitectura y Gestión de Datos
*   **React Server Components (RSC):** Usa RSCs por defecto para leer datos desde el servidor. El contenido de la ficha de una casa es principalmente estático (lectura) por lo que renderizarlo en el servidor ahorra JavaScript pesado al cliente y lo hace más rápido.
*   **Estrategia ISR (Incremental Static Regeneration):** Configura la revalidación (ej. `revalidate = 3600`) para las rutas de detalles de propiedades. No necesitas consultar a la base de datos por cada carga (SSR) si la información cambia poco a lo largo del día. Excepción: estados de "Disponible/Vendido".
*   **Paginación del Lado del Servidor:** Especialmente importante dada tu integración reciente con bases de datos. No envíes todas las propiedades de golpe, aprovecha la paginación con `limit` y `offset` (o cursores) mediante los Server Actions.

## 🔌 Requerimientos de Conversión y Negocio
*   **CTAs de Alto Impacto:** Haz que las acciones de conversión sean omnipresentes sin ser invasivas: "Agendar Visita", "Descargar Brochure" o un botón flotante de "Contactar vía WhatsApp".
*   **Favoritos y Guardados:** Implementa la funcionalidad para que el usuario pueda armar su selección y comparar. Puedes usar LocalStorage para usuarios no registrados y la base de datos para usuarios que inicien sesión.
*   **Mapas Locales Inteligentes:** Muestra no solo dónde está la propiedad, sino qué atractivos o *amenities* sociales tiene cerca (colegios, áreas verdes, servicios).

## 🛡️ Seguridad (Con foco en integraciones como Supabase)
*   **RLS (Row Level Security):** Define políticas estrictas de base de datos. Solo porque una propiedad es pública, no significa que los datos de contacto del dueño anterior, esquemas de comisiones internas u otras variables de base de datos deban viajar al cliente.
*   **Carga de Imágenes Cuidada:** Utiliza CDNs y sistemas (como Supabase Storage) configurados para optimizar la salida de la imagen con reglas sobre el tamaño máximo de archivo para que los administradores no saturen la base de datos con fotos de 10MB sin compresión.

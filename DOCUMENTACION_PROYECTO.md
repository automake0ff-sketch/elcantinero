# EL CANTINERO TAPAS — DOCUMENTACIÓN INTEGRAL DEL PROYECTO WEB

Web moderna, rápida, visual y orientada a conversión comercial para **El Cantinero Tapas** en Sevilla Este.

---

## 1. Información Real del Negocio

* **Nombre:** El Cantinero Tapas (Bar El Cantinero Tapas).
* **Dirección:** Calle Periodista Juan Tribuna, 5, 41020 Sevilla (Sevilla Este / Parque Alcosa).
* **Teléfono:** 642 01 90 26.
* **Instagram:** [@elcantinerotapas](https://www.instagram.com/elcantinerotapas/)
* **Ficha de Google:** [Enlace Oficial de Google Maps](https://share.google/XK6EvAiLEoTqAkeKa)
* **Puntuación media:** 4.8 / 5 estrellas (+280 reseñas reales verificadas).

---

## 2. Experiencia Inicial: Animación de la Croqueta Dorada

Diseñada específicamente para esta web sin dependencias pesadas mediante **HTML5 Canvas 2D + Web Animations API**:
1. **Fase 1 (Aparición y aproximación):** La croqueta dorada flota en el centro con una suave respiración e iluminación cálida con sombras y textura panko crujiente.
2. **Fase 2 (Grietas y vapor):** Se dibujan fisuras con destellos dorados que anticipan la cremosidad interior.
3. **Fase 3 (Explosión de sabor):** Las dos mitades crujientes se separan suavemente revelando la bechamel sedosa y trozos de jamón ibérico, liberando una física de 160 partículas (migas crujientes de panko con rotación, gotas aterciopeladas de crema, destellos aromáticos y estelas de vapor).
4. **Fase 4 (Identidad visual):** Las partículas convergen en un aura dorada revelando el emblema **EL CANTINERO TAPAS · Sevilla Este**.
5. **Fase 5 (Transición fluida):** Se desvanece de forma suave hacia la portada principal.

### Controles y Accesibilidad
* **Botón «Entrar al Restaurante»:** Disponible en la esquina superior derecha y accesible en todo momento para saltar la animación de inmediato.
* **Control de repetición:** Guarda en `sessionStorage` que el usuario ya ha visto la bienvenida para no interrumpir su navegación interna.
* **Botón de reanudación:** En el pie de página se incluye el botón «Ver animación inicial de la croqueta» para que el cliente pueda revivir la experiencia cuando quiera.
* **Soporte `prefers-reduced-motion`:** Si el usuario tiene configurada la reducción de movimiento en su sistema operativo, la animación se omite automáticamente.

---

## 3. Carta Digital Interactiva (`/carta`)

* **Buscador en vivo:** Permite encontrar cualquier plato por nombre, descripción o etiquetas en milisegundos.
* **Filtros por categorías:** Especialidades de la Casa, Desayunos, Tapas Frías, Guisos & Calientes, Pescados & Frituras, Montaditos y Postres Caseros.
* **Filtro de alérgenos:** Selector para filtrar platos libres de determinados alérgenos según el Reglamento UE 1169/2011 (Gluten, Lácteos, Huevos, Pescado, Moluscos, Sésamo, etc.).
* **Ficha individual (Modal):** Despliega la fotografía, descripción, precios diferenciados (Tapa / Ración), ingredientes, alérgenos oficiales y botón para compartir por WhatsApp o redes.
* **Actualización en caliente:** Los platos y categorías se cargan de forma dinámica desde `src/data/carta.json` y pueden gestionarse directamente desde `/admin`.

---

## 4. Panel Privado de Administración (`/admin`)

El propietario o su equipo pueden gestionar la web sin necesidad de editar código:

* **Ruta de acceso:** `/admin/login`
* **Roles de usuario:**
  * **Propietario (`admin`):** Acceso total para crear/eliminar platos, cambiar precios, editar textos de portada, horarios, contacto y descargar copias de seguridad.
  * **Editor (`editor`):** Acceso para activar/desactivar platos agotados y actualizar precios diarios.
* **Gestión de Platos (`/admin/platos`):**
  * Alta de nuevos platos con foto, precio de tapa, precio de ración, categoría y alérgenos.
  * Edición rápida de precios y textos.
  * Botón directo de disponibilidad (Disponible / Agotado) con 1 clic.
  * Eliminación segura con confirmación.
* **Gestión de Contenidos (`/admin/contenido`):**
  * Modificación del teléfono, dirección y redes sociales.
  * Edición de horarios semanales y turnos.
  * Actualización de la historia y valores del restaurante.
* **Copias de Seguridad (`/admin` o `/api/admin/backup`):**
  * Descarga instantánea de un archivo `.json` completo con toda la carta y configuración del negocio.

---

## 5. Preparación 3D y Realidad Aumentada (AR)

Siguiendo estrictamente las especificaciones del proyecto:
* Estructura lista en:
  * `public/assets/modelos/` (para archivos `.glb` WebXR)
  * `public/assets/modelos/usdz/` (para Apple Quick Look en iOS)
* Componente `Visor3DModelViewer.tsx`:
  * **Cero simulación:** Si el plato no tiene un archivo 3D real configurado en su ficha, **no muestra botones falsos ni simula funciones inexistentes**.
  * En cuanto se suba un modelo `.glb`/`.usdz` real y se vincule desde el panel de administración, el visor interactivo se activa automáticamente con soporte de rotación, zoom y proyección sobre la mesa mediante Realidad Aumentada.

---

## 6. SEO Local y Conversión Móvil

* **Schema.org JSON-LD:** Marcado estructurado `Restaurant` / `BarOrPub` con coordenadas exactas de Sevilla Este, dirección en Calle Periodista Juan Tribuna, horarios, rango de precios y enlaces a la carta.
* **Conversión Móvil:** Barra inferior flotante (`FloatingContactBar`) visible en smartphones con botones de acción directa: **Llamar al bar**, **Ver carta** y **Cómo llegar (Google Maps)**.
* **Tarjetas para compartir:** Metadatos OpenGraph configurados para mostrar la croqueta estrella y resumen al enviar enlaces por WhatsApp, Telegram e Instagram.
* **Archivos para buscadores:** `robots.txt` y `sitemap.xml` dinámicos.

---

## 7. Instrucciones para Ejecutar el Proyecto

```bash
# Modo Desarrollo
npm run dev

# Compilar para Producción
npm run build

# Iniciar Servidor de Producción
npm start
```

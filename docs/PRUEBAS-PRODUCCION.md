# REGISTRO DE PRUEBAS DE PRODUCCIÓN

Registro de verificaciones técnicas ejecutadas sobre el proyecto **El Cantinero Tapas (Versión Demo)**.

---

## 1. Pruebas de Compilación y TypeScript

* **Comando:** `npm run build`
* **Resultado:** Código de salida 0 (OK).
* **Verificación:** 17/17 páginas y rutas estáticas y dinámicas generadas sin errores de tipo ni de importación.
* **Resolución TS2607/TS2786:** Importación de `Image from 'next/image'` verificada en todos los componentes.

---

## 2. Pruebas de Calidad de Código (ESLint)

* **Comando:** `npm run lint`
* **Resultado:** Código de salida 0 (OK).
* **Verificación:** Cero errores y cero avisos. Limpieza de variables no utilizadas y llamadas asíncronas de hooks verificadas.

---

## 3. Pruebas de Rutas y Endpoints API

* `/` (HTTP 200 OK): Portada con animación de croqueta, hero, especialidades, historia, galería, testimonios de Google y contacto.
* `/carta` (HTTP 200 OK): Explorador de carta digital con buscador en tiempo real, filtro de alérgenos y detección de mesas QR (`?mesa=X`).
* `/admin/login` (HTTP 200 OK): Formulario de acceso con credenciales demo visibles.
* `/admin` (HTTP 200 OK): Dashboard con los 10 módulos de gestión.
* `/admin/platos` (HTTP 200 OK): CRUD de platos con gestión de borradores y alérgenos.
* `/admin/qr` (HTTP 200 OK): Generación de QRs vectoriales y hoja de impresión.
* `/admin/promociones` (HTTP 200 OK): Programación de ofertas con fechas.
* `/admin/estadisticas` (HTTP 200 OK): Analítica agregada sin PII.
* `/api/admin/backup` (HTTP 200 OK): Exportación y restauración JSON con validación de esquema.

---

## 4. Pruebas de Seguridad de la Demo

* **Autenticación:** Tokens de sesión firmados con cookies seguras `HttpOnly`, `SameSite: 'lax'`.
* **Rate Limiting:** Bloqueo progresivo comprobado tras 5 intentos erróneos de inicio de sesión durante 15 minutos.
* **Autonomía:** Funcionamiento completo sin dependencias externas de bases de datos.

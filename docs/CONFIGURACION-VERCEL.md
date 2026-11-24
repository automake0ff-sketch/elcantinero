# CONFIGURACIÓN DEL PROYECTO EN VERCEL (VERSIÓN DEMO)

Esta guía detalla los pasos para desplegar la versión de demostración de **El Cantinero Tapas** en Vercel con rendimiento óptimo, seguridad y sin requisitos externos de base de datos.

---

## 1. Conexión del Repositorio

1. Inicia sesión en [Vercel](https://vercel.com).
2. Haz clic en **«Add New...» &rarr; «Project»**.
3. Importa el repositorio: `automake0ff-sketch/elcantinero`.
4. En **Framework Preset**, Vercel detectará automáticamente **Next.js**.

---

## 2. Variables de Entorno Opcionales en Vercel

El proyecto funciona de manera autónoma como versión de demostración. Puedes personalizar opcionalmente las siguientes variables:

### Seguridad y Autenticación del Panel (/admin)
* `ADMIN_JWT_SECRET`: Cadena secreta para firmar tokens de sesión (por defecto utiliza clave de demo).
* `ADMIN_OWNER_USER`: Usuario propietario (por defecto `admin`).
* `ADMIN_OWNER_PASS`: Contraseña de propietario (por defecto `Cantinero2026!`).
* `ADMIN_EDITOR_USER`: Usuario editor opcional (por defecto `editor`).
* `ADMIN_EDITOR_PASS`: Contraseña de editor (por defecto `Cantinero2026!`).

### Dominio y Metadatos
* `NEXT_PUBLIC_SITE_URL`: Dominio web canónico para generación de QRs y OpenGraph.  
  *Ejemplo:* `https://elcantinerotapas.es` o el subdominio de Vercel.

---

## 3. Configuración de Build en Vercel

* **Build Command:** `npm run build`
* **Output Directory:** `.next`
* **Install Command:** `npm install`
* **Node.js Version:** `20.x` o `22.x`

---

## 4. Verificación Post-Despliegue

1. Abre la URL del proyecto: comprueba que carga la animación de la croqueta y la página de inicio.
2. Accede a `/carta`: verifica el filtrado de alérgenos y la búsqueda en vivo.
3. Accede a `/admin/login`: comprueba el acceso al panel administrativo con las credenciales demo (`admin` / `Cantinero2026!`).

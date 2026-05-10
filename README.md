# Lumeglow Dashboard

Un proyecto desarrollado con **React 19**, **TypeScript** y **Vite**, demostrando buenas prácticas de desarrollo front-end, estado global, consumo de APIs y autenticación, estructurado con una arquitectura basada en características (Feature-Based Architecture).

## Características

1. **Configuración y Entorno**: Creado con Vite, utiliza Node.js y maneja variables de entorno (`.env`) para integraciones (Supabase).
2. **Estructura del Proyecto**: Separación clara por carpetas funcionales (`features`, `common`, `apis`, `app`).
3. **Componentes Modernos**: Uso avanzado de JSX y componentes funcionales.
4. **Comunicación**: Props y paso de datos eficiente entre componentes.
5. **Manejo de Estado**: Uso de `useState` para control de UI (ej. modales, menús desplegables).
6. **Efectos Secundarios**: Uso de `useEffect` para cargas iniciales (ej. fetching de películas).
7. **Formularios y Eventos**: Login funcional con manejo de inputs, loading states y errores.
8. **Renderizado Dinámico**: Mapeo de listas (películas de IMDB) usando keys correctamente.
9. **Enrutamiento**: Implementado con React Router 7 (`createBrowserRouter`), incluyendo `ProtectedRoute` para acceso condicional.
10. **Consumo de APIs**: Fetching a API externa (IMDB) y a Supabase Auth.
11. **Estado Global**: Integrado a través de Context API (`AuthContext`) para manejar la sesión del usuario.
12. **Hooks y Optimización**: Hooks personalizados (`useAuth`, etc) para encapsular la lógica.
13. **Autenticación**: Supabase Auth (Login/Registro) con persistencia en `LocalStorage`.
14. **Funcionalidad Extra**: Integración de mapas de ubicación en la página "Acerca de".
15. **Diseño Responsivo**: TailwindCSS v4 utilizado para garantizar soporte Desktop, Tablet y Mobile.
16. **Deploy**: Preparado para ser desplegado fácilmente en Vercel o Netlify.

## Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/en/) (v18 o superior recomendado)
- NPM, Yarn o PNPM.

### Pasos

1. **Clonar e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en un posible `.env.example` o usando tus claves de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=tu_supabase_anon_key
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## Estructura de Directorios

- `src/apis/`: Servicios para conectarse a endpoints externos (IMDB, Supabase).
- `src/app/`: Páginas principales que agrupan y exponen las "features" (Home, About, Calendar).
- `src/common/`: Elementos transversales de la aplicación (Contextos, Hooks genéricos, Layout, Aside).
- `src/components/`: Componentes UI reutilizables (Botones, Inputs).
- `src/features/`: Módulos de la aplicación contenidos (Auth, Home, About), encapsulando su lógica y UI propia.
- `src/router/`: Configuración centralizada de React Router y protección de rutas.

## Guía de Despliegue (Deploy)

El proyecto está listo para ser desplegado en plataformas estáticas.

### Vercel
1. Ingresa a [Vercel](https://vercel.com) e inicia sesión con GitHub/GitLab.
2. Haz clic en **Add New Project** y selecciona tu repositorio.
3. El Framework Preset debería detectarse automáticamente como **Vite**.
4. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Haz clic en **Deploy**. Vercel ejecutará `npm run build` y publicará tu aplicación.

### Netlify
1. Ingresa a [Netlify](https://www.netlify.com) y selecciona **Add new site** > **Import an existing project**.
2. Conecta tu repositorio.
3. Configuración de Build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. En **Advanced build settings**, añade las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
5. Haz clic en **Deploy site**.

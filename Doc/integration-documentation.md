# Integration Documentation

## Overview
This document summarizes the main integrations used by the `KofiLartey Studios` frontend application.

The project is a React application built with Vite and Tailwind CSS, deployed via Netlify, and using Axios to communicate with an external API backend.

---

## 1. Build & Development Tooling

### Vite
- Configured in `vite.config.js`
- Uses `@vitejs/plugin-react` for React fast refresh and JSX support
- Uses `@tailwindcss/vite` to enable Tailwind CSS processing
- Custom Rollup chunking ensures vendor libraries like `react`, `react-dom`, and `react-router-dom` are separated into a `vendor` chunk

### npm scripts
Defined in `package.json`:
- `npm run dev` — start Vite development server
- `npm run build` — build production bundle into `dist`
- `npm run preview` — preview the built app locally
- `npm run lint` — run ESLint over the project
- `npm run generate-icons` — generate PWA app icons from a remote source into `public/icons`

---

## 2. Frontend Frameworks & Libraries

### React
- Core UI framework used across `src/`
- Components are structured in `src/components`, `src/componets`, and `src/pages`

### React Router DOM
- Client-side routing is present via `react-router-dom` (version `7.x`)
- Used to manage navigation between pages like `Login`, `Registration`, `Dashboard`, `ClientGallery`, `Settings`, and more

### Tailwind CSS
- Styling utility library integrated through Vite plugin
- Tailwind classes are used in all JSX components for layout, typography, UI states, spacing, and responsive design

### React Icons
- Uses `react-icons` for iconography across the dashboard and UI controls
- Includes icon packs from `react-icons/fi` and `react-icons/fa`

### Framer Motion
- Installed and available for animated transitions and motion UI effects

### browser-image-compression
- Installed for client-side image compression support

### JSZip
- Installed for zip archive creation or download packaging workflows

---

## 3. API Integration

### Axios
- Centralized HTTP client configured in `src/utils/apiCall.js`
- Supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`
- Sends credentials with requests via `withCredentials: true`

### Authorization
- Requests automatically include a bearer token from `localStorage`
- Token keys checked: `token`, `authToken`
- If a `401 Unauthorized` response is returned, the app redirects to `/login`

### Base API URL
- Configured using environment variable: `VITE_API_URL`
- Loaded through `import.meta.env.VITE_API_URL`
- Cleaned to remove trailing slashes before use

---

## 4. Progressive Web App (PWA) & Offline Support

### Web App Manifest
Defined in `public/manifest.json`
- `name`: `KofiLartey Studios`
- `short_name`: `KofiLartey`
- `start_url`: `/dashboard`
- `display`: `standalone`
- Theme and background colors provided
- Multiple icon sizes referenced from `/icons`

### Apple support
Defined in `index.html`
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- Several `apple-touch-icon` sizes

### Service Worker
Defined in `public/sw.js`
- Caches static assets and offline page `offline.html`
- Caches specific SPA routes for offline fallback
- Skips caching API requests under `/api/`
- Provides offline response for navigation requests
- Supports cache versioning through `CACHE_NAME`

### Offline page
- `public/offline.html` is the fallback displayed when a route is unavailable offline

---

## 5. Deployment & Hosting

### Netlify
Configured in `netlify.toml`
- `build.command`: `npm run build`
- `publish`: `dist`
- Redirects all routes to `index.html` via a fallback rule

### Single Page App routing
- `[[redirects]]` entry ensures client-side routes work on refresh and deep links

---

## 6. Asset Generation & Static Files

### Icon generation script
- `scripts/generate-icons.cjs` downloads a remote logo and generates PNG icons for PWA use
- Output directory: `public/icons`
- Icon sizes supported: `72`, `96`, `128`, `144`, `152`, `192`, `256`, `384`, `512`

### Static assets
- `public/icons/` contains PWA icon assets
- `public/manifest.json` and `public/sw.js` support PWA setup
- `public/manifest-client.json` is present as an additional manifest
- `public/_redirects` configures route fallback for Netlify

---

## 7. Environment Configuration

### Environment variables
- `VITE_API_URL` is the primary runtime variable
- Set in the local or production environment where the frontend is deployed

### `package.json` type
- `type: "module"` enables ES module support in package scripts and config files

---

## 8. Notes & Recommended Checks

- Confirm `VITE_API_URL` is set correctly in Netlify environment settings for production
- Ensure the PWA icons exist in `public/icons` before building for deployment
- Keep token storage keys and API endpoints consistent between frontend and backend
- Review `vite.config.js` proxy settings if local API proxying is needed during development

---

## 9. Relevant Files

- `package.json`
- `vite.config.js`
- `netlify.toml`
- `src/utils/apiCall.js`
- `public/manifest.json`
- `public/sw.js`
- `public/offline.html`
- `scripts/generate-icons.cjs`
- `index.html`

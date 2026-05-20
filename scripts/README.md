# KofiLartey Studios PWA Scripts

## Generate Icons

Run the icon generation script:

```bash
npm run generate-icons
```

This will:
- Download the logo from the provided URL
- Generate all icon sizes (72, 96, 128, 144, 152, 192, 256, 384, 512)
- Save them to `public/icons/`

**Note:** For maskable icons, visit https://app-manifest.firebaseapp.com/

## PWA Features

### Install Button (Photographers)
- Shows when the app can be installed (beforeinstallprompt event)
- Positioned at bottom-right with pink gradient
- Uses framer-motion for smooth animations

### Client Install Prompt (Clients)
- Shows on client gallery/slideshow pages
- Prompts clients to "Save This Event" to their home screen
- Auto-shows after 3 seconds

### Service Worker
- Caches static assets and pages
- Shows offline page when network is unavailable
- Does NOT cache dynamic API calls (photos, orders, messages)

### Files Structure
```
public/
  manifest.json          # Main manifest for photographers
  manifest-client.json   # Client manifest for slideshow pages
  sw.js                  # Service worker
  offline.html           # Offline fallback page
  icons/                 # Generated icons
src/
  components/
    InstallButton.jsx    # Photographer install button
    ClientInstallPrompt.jsx  # Client install prompt
  hooks/
    usePWAInstall.js     # Custom hook for PWA detection
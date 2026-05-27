import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })

  // EXTRA RELIABILITY FIX (HIGHLY RECOMMENDED)
  // Add this once in your app (helps PWA downloads)
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "DOWNLOAD_BLOB") {
      const { blob, filename } = event.data;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      setTimeout(() => URL.revokeObjectURL(url), 8000);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </BrowserRouter>
)
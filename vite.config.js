import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
          }
        },
      },
    },
  }
  // server: {
  //   proxy: {
  //     // When you call '/api/V1/...', Vite forwards it to Render
  //     '/api': {
  //       target: 'https://kofilarte-studios-backend.onrender.com',
  //       changeOrigin: true,
  //       secure: false, 
  //     }
  //   }
  // }
});
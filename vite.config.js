import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Polyfill: hace que cualquier uso de `global` apunte al objeto window
  define: { global: 'window' },
  resolve: {
    alias: {
      process: 'process',
      buffer: 'buffer',
    },
  },
  // Fuerza a Vite a preoptimizar estos paquetes (evita errores en dev/build)
  optimizeDeps: {
    include: ['buffer', 'process', 'amazon-cognito-identity-js', 'jwt-decode'],
  },
  server: { port: 5173, open: true },
})

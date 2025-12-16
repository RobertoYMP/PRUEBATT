import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: { global: 'window' },
  resolve: {
    alias: {
      process: 'process',
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'amazon-cognito-identity-js', 'jwt-decode'],
  },
  server: { port: 5173, open: true },
})

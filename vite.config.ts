import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      // 1. CSP frame-ancestors
      'Content-Security-Policy': "frame-ancestors 'none';",
      // 2. X-Frame-Options
      'X-Frame-Options': 'DENY'
    }
  },
})

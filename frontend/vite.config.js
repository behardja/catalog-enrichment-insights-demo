import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Behind the Vertex AI Workbench proxy the app is served from
  // /proxy/<PORT>/, so absolute asset URLs need that prefix. server.py sets
  // VITE_BASE when launched with --proxy-base.
  base: process.env.VITE_BASE || '/',
  server: {
    host: true,           // bind 0.0.0.0 so it's reachable from outside the VM
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
    fs: { strict: false },
  },
})

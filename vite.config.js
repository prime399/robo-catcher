import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  base: './',
}); 
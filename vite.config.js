import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Base relativa es OBLIGATORIA para SCORM: el LMS servirá el contenido
// desde una ruta arbitraria y cualquier path absoluto rompería el paquete.
export default defineConfig({
  base: './',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@game': resolve(__dirname, 'src/game'),
      '@scorm': resolve(__dirname, 'src/scorm'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'es2018',
    cssCodeSplit: false,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});

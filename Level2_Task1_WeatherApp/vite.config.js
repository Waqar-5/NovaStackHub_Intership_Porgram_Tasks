import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
  },
});

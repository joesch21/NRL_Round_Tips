import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Ensure React is included
  define: {
    'process.env.VITE_RELAYER_PRIVATE_KEY': JSON.stringify(process.env.VITE_RELAYER_PRIVATE_KEY),
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Avoid large chunk warnings
  }
});

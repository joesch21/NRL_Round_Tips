import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env.VITE_RELAYER_PRIVATE_KEY': JSON.stringify(process.env.VITE_RELAYER_PRIVATE_KEY),
  },
});

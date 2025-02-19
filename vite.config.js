import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default defineConfig({
  define: {
    'process.env.VITE_RELAYER_PRIVATE_KEY': JSON.stringify(process.env.VITE_RELAYER_PRIVATE_KEY),
  },
});

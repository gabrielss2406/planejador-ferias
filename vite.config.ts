import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // dev: o servidor de grupos roda à parte (npm run server) e o Vite repassa /api para ele
  server: { proxy: { '/api': 'http://localhost:3001' } },
});

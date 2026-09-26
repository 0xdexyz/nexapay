import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
    proxy: {
      '/api/rpc': {
        target: 'https://solana-rpc.publicnode.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/'
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});

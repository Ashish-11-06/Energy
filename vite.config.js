import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'font-family': 'Inter, sans-serif',
          'primary-color': '#669800', // Primary color
          'link-color': '#9A8406', // Link color
          'body-background': '#F5F6FB', // Body background
          'border-color-base': '#E6E8F1', // Border color
        },
        javascriptEnabled: true,
      },
    },
  }, 
  server: {
    port: 3001,
    open: true,
    historyApiFallback: true, 
  },
});

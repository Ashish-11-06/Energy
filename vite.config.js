import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#669800',
          'link-color': '#9A8406',
          'font-family': 'Inter, sans-serif',
          'body-background': '#F5F6FB',
          'border-color-base': '#E6E8F1',
        },
      },
    },
  },
})

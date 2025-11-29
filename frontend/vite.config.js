import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'; 
dotenv.config(); 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL, // This must match the .env key
        changeOrigin:true,
      }
    }
  }
})

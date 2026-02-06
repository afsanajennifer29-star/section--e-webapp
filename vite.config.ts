import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/section--e-webapp/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})

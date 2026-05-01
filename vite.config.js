import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/dog-behavior-monitors/'  // 👈 correct for GitHub Pages
})
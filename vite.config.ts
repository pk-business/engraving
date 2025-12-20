import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base for built assets so the site works from any path
  // (useful for GitHub Pages, subfolders, and local file previews).
  base: './',
  plugins: [react()],
});

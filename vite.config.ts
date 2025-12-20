import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // When deploying to GitHub Pages set the base to the repository name
  // (e.g. '/engraving/'). This ensures built asset URLs are correct.
  base: '/engraving/',
  plugins: [react()],
});

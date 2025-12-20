import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isPreview = mode === 'preview' || process.env.VITE_FORCE_BASE === 'true';
  return {
    base: isPreview ? '/engraving/' : '/',
    plugins: [react()],
  };
});

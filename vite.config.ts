import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { songSharePages } from './scripts/song-share-pages'

// Base path: '/' for local/custom-domain, '/setivir/' for GitHub Pages.
// `npm run build:pages` sets VITE_BASE=/setivir/ automatically.
const base = process.env.VITE_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), songSharePages()],
  build: {
    // Audio files are large; keep them as-is in public/ rather than inlining.
    assetsInlineLimit: 0,
  },
})

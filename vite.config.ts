import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: `base` must match the GitHub repo name for project-page hosting
// (https://<user>.github.io/<repo>/). Change it here if the repo is renamed.
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio-Website/',
  build: {
    chunkSizeWarningLimit: 1200,
  },
})

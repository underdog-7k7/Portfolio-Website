import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function lastCommitDate(): string {
  try {
    return execSync('git log -1 --format=%cI').toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

// IMPORTANT: `base` must match the GitHub repo name for project-page hosting
// (https://<user>.github.io/<repo>/). Change it here if the repo is renamed.
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio-Website/',
  define: {
    __LAST_UPDATED__: JSON.stringify(lastCommitDate()),
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})

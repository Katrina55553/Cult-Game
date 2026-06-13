import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isPagesDeploy =
  process.env.GITEE_PAGES === 'true' || process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isPagesDeploy ? '/Cult-Game/' : '/',
  plugins: [react(), tailwindcss()],
})

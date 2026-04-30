import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-kinetic-ui']
  },
  resolve: {
    alias: {
      '@deekshaaa/kinetic-ui': 'react-kinetic-ui'
    }
  }
})

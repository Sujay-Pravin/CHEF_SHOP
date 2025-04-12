import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // Expose env variables to the client
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || '---add appropriate api url here---',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})

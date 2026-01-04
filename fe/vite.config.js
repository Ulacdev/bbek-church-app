import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  const appURL = env.VITE_API_URL || 'http://localhost:5000'
  
  console.log('🔧 Vite Configuration:')
  console.log('   Frontend URL: http://localhost:5174')
  console.log('   Backend API URL:', appURL)
  console.log('   Proxy: /api →', appURL)
  
  return {
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0', // This allows access from any IP address
      port: 5174, // You can specify a port if needed
      proxy: {
        '/api': {
          target: appURL,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            // Advanced proxy configuration
            proxy.on('error', (err, req, res) => {
              console.error('❌ Proxy Error:', err.message)
              console.error('   Target URL:', appURL)
              console.error('   Request URL:', req.url)
              
              // Handle ECONNREFUSED specifically
              if (err.code === 'ECONNREFUSED') {
                console.error('   ⚠️  Connection Refused - Backend server is not running!')
                console.error('   💡 Make sure the backend is running on:', appURL)
                console.error('   💡 Start backend with: cd church-be && npm run dev')
              }
              
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json'
                })
                res.end(JSON.stringify({
                  error: 'Proxy Error',
                  message: err.code === 'ECONNREFUSED' 
                    ? 'Backend server is not running. Please start the backend server.'
                    : err.message,
                  target: appURL
                }))
              }
            })
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('📤 Sending Request to:', req.method, req.url, '→', appURL + req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📥 Received Response:', req.method, req.url, 'Status:', proxyRes.statusCode)
            })
          }
        }
      }
    }
  }
})


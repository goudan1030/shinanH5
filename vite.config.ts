import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import postcssPresetEnv from 'postcss-preset-env'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 支持 antd-mobile 的自定义标签
          isCustomElement: tag => tag.startsWith('adm-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['antd-mobile'],
    // 不排除 node_modules
    exclude: []
  },
  build: {
    commonjsOptions: {
      // 包含 node_modules
      include: [/node_modules/]
    },
    target: ['es2015', 'chrome49', 'ios10']
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            'custom-properties': {
              preserve: false
            }
          }
        })
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  publicDir: 'public'
})

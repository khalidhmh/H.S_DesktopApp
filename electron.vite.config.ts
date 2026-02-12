import { join } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': join(process.cwd(), 'src/shared')
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@shared': join(process.cwd(), 'src/shared')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': join(process.cwd(), 'src/renderer/src'),
        '@shared': join(process.cwd(), 'src/shared')
      }
    },
    define: {
      global: 'window'
    },
    plugins: [react()]
  }
})

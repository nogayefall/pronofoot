import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const hotFile = fileURLToPath(new URL('../backend/public/admin-assets/hot', import.meta.url))
const vitePort = Number(process.env.VITE_PORT ?? 5174)
const backendUrl = process.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:8001'

function laravelHotFile() {
  return {
    name: 'pronofoot-laravel-hot-file',
    configureServer(server) {
      mkdirSync(dirname(hotFile), { recursive: true })
      const viteUrl = server.resolvedUrls?.local?.[0] ?? `http://127.0.0.1:${vitePort}`
      writeFileSync(hotFile, `${viteUrl}\n`)
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://vite.local').pathname

        if (pathname === '/' || pathname === '/index.html') {
          response.statusCode = 302
          response.setHeader('Location', new URL('/login', backendUrl).toString())
          response.end()

          return
        }

        next()
      })
      server.httpServer?.once('close', () => {
        if (existsSync(hotFile)) {
          unlinkSync(hotFile)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), laravelHotFile()],
  server: {
    host: '127.0.0.1',
    port: vitePort,
    strictPort: true,
    open: '/',
    cors: {
      origin: [
        'http://localhost',
        'http://127.0.0.1',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://localhost:8001',
        'http://127.0.0.1:8001',
      ],
    },
  },
  build: {
    outDir: fileURLToPath(new URL('../backend/public/admin-assets', import.meta.url)),
    emptyOutDir: true,
    minify: 'esbuild',
    lib: {
      entry: fileURLToPath(new URL('./src/main.jsx', import.meta.url)),
      formats: ['es'],
      fileName: 'app',
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },
  define: {
  'process.env.NODE_ENV': JSON.stringify('production'),
},
})

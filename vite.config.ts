/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import path from 'node:path'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  const isDev = command === 'serve'
  const isAnalyze = mode === 'analyze'

  const plugins = [
    react({
      // Babel configuration for development
      babel: isDev ? {
        plugins: [
          // Add development-only babel plugins here
        ]
      } : undefined,
    }),
    
    // Tanstack Router plugin for automatic route generation
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
    }),
  ]

  // Add bundle analyzer only in analyze mode
  if (isAnalyze) {
    const { visualizer } = require('rollup-plugin-visualizer')
    plugins.push(
      visualizer({
        filename: 'build-report.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return {
    plugins,

    // Path resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/store': path.resolve(__dirname, './src/store'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/tests': path.resolve(__dirname, './src/tests'),
      },
    },

    // CSS configuration
    css: {
      devSourcemap: isDev,
      modules: {
        // CSS Modules configuration
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev 
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    // Development server configuration
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      open: isDev ? '/dashboard' : false,
      proxy: {
        // Proxy API requests to backend in development
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      cors: true,
      // HMR configuration
      hmr: {
        port: 3001,
        overlay: true,
      },
      // File watching
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
    },

    // Preview server configuration (for production builds)
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      cors: true,
    },

    // Build configuration
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev || env.GENERATE_SOURCEMAP === 'true',
      minify: isDev ? false : 'esbuild',
      
      // Rollup configuration
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['@tanstack/react-router'],
            ui: ['lucide-react', 'clsx', 'tailwind-merge'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            utils: ['date-fns', 'axios'],
          },
          // Asset naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') ?? []
            let extType = info[info.length - 1] ?? ''
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images'
            } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts'
            }
            
            return `${extType}/[name]-[hash][extname]`
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
        external: [],
      },

      // Build optimizations
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: !isDev,
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Asset inlining threshold
      assetsInlineLimit: 4096,
      
      // Clean output directory before build
      emptyOutDir: true,
    },

    // Optimization configuration
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        '@tanstack/react-router',
        'axios',
        'zustand',
        'react-hook-form',
        'zod',
        'date-fns',
        'lucide-react',
        'clsx',
        'tailwind-merge',
      ],
      exclude: ['@tanstack/router-devtools'],
      // Force pre-bundling of certain packages
      force: false,
    },

    // ESBuild configuration
    esbuild: {
      target: 'es2020',
      // Remove console and debugger in production
      drop: isDev ? [] : ['console', 'debugger'],
      // Minify identifiers in production
      minifyIdentifiers: !isDev,
      minifySyntax: !isDev,
      minifyWhitespace: !isDev,
      // Preserve license comments
      legalComments: 'eof',
    },

    // Environment variables
    envPrefix: 'VITE_',
    envDir: '.',

    // Worker configuration
    worker: {
      format: 'es',
      plugins: () => [
        react(),
      ],
    },

    // JSON configuration
    json: {
      namedExports: true,
      stringify: false,
    },

    // Logging configuration
    logLevel: isDev ? 'info' : 'warn',
    clearScreen: false,

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __DEV__: isDev,
    },

    // Vitest configuration (when running tests)
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/tests/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
          '**/dist/**',
        ],
      },
    },

    // Experimental features
    experimental: {
      // Enable experimental features if available
    },
  }
})
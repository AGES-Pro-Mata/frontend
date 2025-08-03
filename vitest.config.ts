/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./src/tests/setup.ts'],
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/build/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/src/main.tsx',
        '**/src/vite-env.d.ts',
        '**/src/routeTree.gen.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      all: true,
      include: ['src/**/*.{ts,tsx}'],
    },
    
    // Test files
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      'build',
      '.idea',
      '.git',
      '.cache',
      'tests/e2e',
    ],
    
    // Watch configuration
    watch: {
      exclude: ['node_modules', 'dist', 'build'],
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Hooks timeout
    hookTimeout: 10000,
    
    // Silent console logs during tests (can be overridden per test)
    silent: false,
    
    // Reporter configuration
    reporter: process.env.CI 
      ? ['verbose', 'junit', 'json'] 
      : ['verbose'],
    
    outputFile: {
      junit: './test-results/junit.xml',
      json: './test-results/test-results.json',
    },
    
    // Threads configuration
    threads: true,
    maxThreads: process.env.CI ? 1 : undefined,
    minThreads: process.env.CI ? 1 : undefined,
    
    // Dependencies optimization
    deps: {
      // Inline dependencies that need to be transformed
      inline: [
        '@testing-library/jest-dom',
        '@testing-library/react',
        '@testing-library/user-event',
      ],
    },
    
    // UI configuration for development
    ui: !process.env.CI,
    
    // Benchmark configuration
    benchmark: {
      include: ['**/*.{bench,benchmark}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    
    // Mock configuration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Environment configuration
    env: {
      NODE_ENV: 'test',
      VITE_API_URL: 'http://localhost:8080/api',
      VITE_APP_ENV: 'test',
    },
    
    // Pool options
    poolOptions: {
      threads: {
        // Use happy-dom for faster tests in threads
        singleThread: false,
      },
    },
  },
  
  // Esbuild configuration for faster builds
  esbuild: {
    target: 'node14',
  },
});
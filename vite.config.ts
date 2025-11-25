import { defineConfig } from "vitest/config";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// Importe os helpers de URL e path do Node.js
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "tests/integration/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      reportsDirectory: "./coverage"
    },
    css: {
      include: [/.*/],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["@tanstack/react-router"],
          "query-vendor": ["@tanstack/react-query"],
          "ui-vendor": ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      // Use fileURLToPath e import.meta.url para criar o alias
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ["msw"],
  },
  server: {
    host: "0.0.0.0", // Essential for container access
    port: 3000,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "promata.com.br",
      ".promata.com.br", // Allow all subdomains
      "*.azure.com", // Azure domains
      "*.azurewebsites.net", // Azure App Service domains
      "ec2-3-139-75-61.us-east-2.compute.amazonaws.com",
    ],
    cors: {
      origin: [
        "http://localhost:3000",
        "https://promata.com.br",
        "https://www.promata.com.br",
        "https://api.promata.com.br",
        "http://ec2-3-139-75-61.us-east-2.compute.amazonaws.com",
        /^https:\/\/.*\.promata\.com\.br$/,
        /^https:\/\/.*\.azure\.com$/,
        /^https:\/\/.*\.azurewebsites\.net$/,
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    },
    strictPort: false, // Allow fallback ports if 3000 is busy
  },
  preview: {
    host: "0.0.0.0", // For production preview
    port: 8080,
    strictPort: false,
  },
});

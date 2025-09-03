import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// Importe os helpers de URL e path do Node.js
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Use fileURLToPath e import.meta.url para criar o alias
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
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
    ],
    cors: {
      origin: [
        "http://localhost:3000",
        "https://promata.com.br",
        "https://www.promata.com.br",
        "https://api.promata.com.br",
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
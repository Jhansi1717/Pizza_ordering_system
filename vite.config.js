import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pizza.svg'],
      manifest: {
        name: 'SliceMind AI Pizza',
        short_name: 'SliceMind',
        description: 'World\'s first AI-powered pizza delivery experience.',
        theme_color: '#111827',
        background_color: '#f9fafb',
        display: 'standalone',
        icons: [
          {
            src: 'pizza.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    host: true
  }
});

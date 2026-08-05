import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (moduleId) => {
          if (moduleId.includes('node_modules')) {
            if (moduleId.includes('@apollo') || moduleId.includes('graphql')) return 'apollo';
            if (moduleId.includes('react') || moduleId.includes('react-dom') || moduleId.includes('react-router')) return 'react';
            if (moduleId.includes('lucide-react') || moduleId.includes('@base-ui') || moduleId.includes('clsx') || moduleId.includes('tailwind')) return 'ui';
            return 'vendor';
          }
          return null;
        }
      },
    },
  },
})

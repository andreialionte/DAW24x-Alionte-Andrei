import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'; //from rollup bundler

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }), // visualize bundle size
  ],
  build: {
    minify: 'terser', // terser for minification
    chunkSizeWarningLimit: 600, // chunk size warning limit
    cssCodeSplit: true, // split css files or better caching
    sourcemap: true, // enable sourcemaps for easier debugging
  },
  server: {
    port: 3000, // Set the desired port
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000', // Backend API URL
    //     changeOrigin: true,
    //     secure: false, // Disable SSL verification for the proxy
    //   },
    // },
  },
})

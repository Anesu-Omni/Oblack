import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // You can import global SCSS variables/mixins here if needed
        // For example: additionalData: `@import "./src/styles/_variables.scss"; @import "./src/styles/_mixins.scss";`,
      },
    },
  },
});
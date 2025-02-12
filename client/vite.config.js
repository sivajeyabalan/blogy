import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "redux", "react-redux"], // Example of manual chunking
        },
      },
    },
    chunkSizeWarningLimit: 600, // Adjust the chunk size warning limit
  },
});

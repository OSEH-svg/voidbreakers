import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: "./",

  build: {
    target: "esnext",
    minify: "esbuild",

    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },

  esbuild: {
    target: "esnext", 
  },

  server: {
    fs: {
      strict: false,
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});

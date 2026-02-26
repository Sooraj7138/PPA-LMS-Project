import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  //Matched with the backend server URL to avoid CORS issues during development
  server: {
    proxy: {
      "/geoserver": {
        target: "https://ppa-lms.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
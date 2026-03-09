import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  site: "https://www.owntube.tv",
  server: {
    host: "::",
    port: 8080,
  },
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});

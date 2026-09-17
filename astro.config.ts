import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.owntube.tv",
  // Astro 7 defaults to JSX whitespace rules, which drop the space between inline elements on separate source lines
  // (e.g. "Phone:</span>\n<a>"). `true` keeps the lossless compression Astro 5 used.
  compressHTML: true,
  server: {
    host: "::",
    port: 8080,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});

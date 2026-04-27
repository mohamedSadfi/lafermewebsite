// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.lafermetunisosuisse.com",
  output: "static",
  adapter: netlify(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr"],
    // Future: ["fr", "en", "ar"]
  },
  image: {
    responsiveStyles: true,
  },
});

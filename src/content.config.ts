import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Products sold at the farm market.
 * Each entry is a Markdown file under src/content/products/.
 * Edit a file to update the catalog — no code changes needed.
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      season: z.enum([
        "Toute l'année",
        "Printemps",
        "Été",
        "Automne",
        "Hiver",
      ]),
      order: z.number().default(0),
      image: image(),
      description: z.string(),
    }),
});

export const collections = { products };

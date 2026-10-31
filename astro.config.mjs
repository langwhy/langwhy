// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { satteri } from "@astrojs/markdown-satteri";
import { autolinkPlugin } from "./src/lib/autolink.mjs";

// Unverified cards stay out of the sitemap (and carry noindex) until a human checked them.
const unverified = readdirSync("./data/languages")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => parse(readFileSync(`./data/languages/${f}`, "utf8")))
  .filter((c) => c && c.verified === false)
  .map((c) => `https://langwhy.dev/lang/${c.id}/`);

export default defineConfig({
  site: "https://langwhy.dev",
  trailingSlash: "ignore",
  // Every language name and glossary term in Markdown links to its card or definition.
  markdown: { processor: satteri({ hastPlugins: [autolinkPlugin()] }) },
  integrations: [
    sitemap({
      filter: (page) => !unverified.includes(page) && !page.endsWith("/search/") && !page.endsWith("/404/"),
    }),
  ],
});

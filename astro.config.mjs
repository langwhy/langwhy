// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { satteri } from "@astrojs/markdown-satteri";
import { autolinkPlugin } from "./src/lib/autolink.mjs";

// Of the language pages only verified cards go in the sitemap. Unverified cards and the PLDB pages
// without a card carry noindex until a human checked them.
const verified = readdirSync("./data/languages")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => parse(readFileSync(`./data/languages/${f}`, "utf8")))
  .filter((c) => c && c.verified === true)
  .map((c) => `https://langwhy.dev/lang/${c.id}/`);
const indexed = (page) => !page.includes("/lang/") || verified.includes(page);

export default defineConfig({
  site: "https://langwhy.dev",
  trailingSlash: "ignore",
  // Every language name and glossary term in Markdown links to its card or definition.
  markdown: { processor: satteri({ hastPlugins: [autolinkPlugin()] }) },
  integrations: [
    sitemap({
      filter: (page) => indexed(page) && !page.endsWith("/search/") && !page.endsWith("/404/"),
    }),
  ],
});

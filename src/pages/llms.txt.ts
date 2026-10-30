import type { APIRoute } from "astro";
import { allCards, cardUrl } from "../lib/data";
import { SITE, SLOTS } from "../lib/vocab";

export const GET: APIRoute = async () => {
  const cards = await allCards();
  const lines = [
    "# langwhy",
    "",
    "> Why every programming language exists, what it trades away, and where it won. One card per language with sources. Data is CC0 (public domain).",
    "",
    "Each card answers: born from (the concrete pain), trades away (memory, types, run, concurrency, cost), where it won (named deployments with sources), alive (status, timeline). Cards marked draft were written by an agent and not yet verified by a human.",
    "",
    "## Languages",
    ...cards.map((c) => `- [${c.name}](${cardUrl(c.id, ".md")}): ${c.tagline}${c.verified ? "" : " (draft)"}`),
    "",
    "## Slots",
    ...Object.entries(SLOTS).map(([slot, what]) => `- [${slot}](${SITE}/slot/${slot}/): ${what}`),
    "",
    "## Data",
    `- [All cards as JSON](${SITE}/api/v1/languages.json)`,
    `- [Everything as one Markdown file](${SITE}/llms-full.txt)`,
    `- [Repository, schema and contribution rules](https://github.com/langwhy/langwhy)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

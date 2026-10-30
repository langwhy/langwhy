import type { APIRoute } from "astro";
import { allCards, cardUrl } from "../../../lib/data";

export const GET: APIRoute = async () => {
  const cards = await allCards();
  const body = {
    version: 1,
    license: "CC0-1.0",
    generated: new Date().toISOString().slice(0, 10),
    schema: "https://github.com/langwhy/langwhy/blob/main/data/schema/language.schema.json",
    languages: cards.map((c) => ({ ...c, url: cardUrl(c.id), json: cardUrl(c.id, ".json"), markdown: cardUrl(c.id, ".md") })),
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};

import type { APIRoute } from "astro";
import { allCards, proseBody, cardMarkdown } from "../lib/data";

export const GET: APIRoute = async () => {
  const cards = await allCards();
  const parts = ["# langwhy: every card", "", "Data is CC0. Source: https://github.com/langwhy/langwhy", ""];
  for (const card of cards) parts.push(cardMarkdown(card, await proseBody(card.id)), "");
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

import type { APIRoute } from "astro";
import { allCards, proseBody, cardMarkdown } from "../../lib/data";

export async function getStaticPaths() {
  const cards = await allCards();
  return cards.map((card) => ({ params: { id: card.id }, props: { card } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { card } = props;
  return new Response(cardMarkdown(card, await proseBody(card.id)), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};

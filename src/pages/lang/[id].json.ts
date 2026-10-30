import type { APIRoute } from "astro";
import { allCards, proseBody, cardUrl } from "../../lib/data";

export async function getStaticPaths() {
  const cards = await allCards();
  return cards.map((card) => ({ params: { id: card.id }, props: { card } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { card } = props;
  const body = { ...card, prose: await proseBody(card.id), url: cardUrl(card.id), markdown: cardUrl(card.id, ".md"), license: "CC0-1.0" };
  return new Response(JSON.stringify(body, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};

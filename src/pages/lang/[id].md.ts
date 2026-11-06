import type { APIRoute } from "astro";
import { allCards, proseBody, cardMarkdown } from "../../lib/data";
import { uncarded, edges, pldbMarkdown } from "../../lib/pldb";

export async function getStaticPaths() {
  const cards = await allCards();
  const tree = edges(cards);
  return [
    ...cards.map((card) => ({ params: { id: card.id }, props: { card } })),
    ...uncarded(cards).map((p) => ({ params: { id: p.id }, props: { pldb: p, tree } })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const { card, pldb, tree } = props;
  if (!card) return new Response(pldbMarkdown(pldb, tree), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
  return new Response(cardMarkdown(card, await proseBody(card.id)), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};

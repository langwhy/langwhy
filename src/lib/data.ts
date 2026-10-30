import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { AXES, FIT_DOTS, SITE } from "./vocab";

export type Card = CollectionEntry<"cards">["data"];

export async function allCards(): Promise<Card[]> {
  const entries = await getCollection("cards");
  return entries.map((e) => e.data).sort((a, b) => a.name.localeCompare(b.name));
}

export async function proseBody(id: string): Promise<string> {
  const entry = await getEntry("prose", id);
  return entry?.body ?? "";
}

/** Cards that list `id` among their parents. */
export function childrenOf(id: string, cards: Card[]): Card[] {
  return cards.filter((c) => c.reacts_to.includes(id));
}

export function cardUrl(id: string, ext = ""): string {
  return ext ? `${SITE}/lang/${id}${ext}` : `${SITE}/lang/${id}/`;
}

/** The Markdown twin of a card: every fact, then the prose. Served at /lang/<id>.md. */
export function cardMarkdown(card: Card, prose: string): string {
  const t = card.tradeoffs;
  const line = (label: string, value: string) => `- **${label}:** ${value}`;
  const out = [
    `# ${card.name}`,
    "",
    `> ${card.tagline}`,
    "",
    line("Appeared", String(card.appeared)),
    line("Creators", card.creators.join(", ")),
    ...(card.org ? [line("Maintained by", card.org)] : []),
    line("Type", card.type),
    line("Status", card.status),
    line("Born from", card.born_from),
    line("Reacts to", card.reacts_to.join(", ") || "–"),
    line("Trade-offs", `${AXES.memory[t.memory]}; ${AXES.types[t.types]}; ${AXES.run[t.run]}; concurrency: ${t.concurrency.join(", ")}. Cost: ${t.cost}`),
    line("Slots", card.slots.map((s) => `${s.slot} ${FIT_DOTS[s.fit]} ${s.fit}${s.note ? ` (${s.note})` : ""}`).join("; ")),
    line("Alternatives", card.alternatives.join(", ") || "–"),
    line("Won where", card.won_where.map((w) => `${w.what} [source](${w.source})`).join("; ")),
    line("Timeline", card.timeline.map((e) => `${e.year}: ${e.what} [source](${e.source})`).join("; ")),
    ...(card.hardware ? [line("Hardware", Object.entries(card.hardware).map(([k, v]) => `${k}=${v}`).join(", "))] : []),
    line("Links", Object.entries(card.links).map(([k, v]) => `[${k}](${v})`).join(", ")),
    ...(card.pldb ? [line("PLDB", `https://pldb.io/concepts/${card.pldb}.html`)] : []),
    line("Sources", card.sources.join(", ")),
    line("Verified", card.verified ? `yes, reviewed ${card.last_reviewed}` : `no, draft of ${card.last_reviewed}`),
    line("Canonical", cardUrl(card.id)),
    "",
    prose.trim(),
    "",
    `---`,
    `Data: CC0, https://github.com/langwhy/langwhy/blob/main/data/languages/${card.id}.yaml`,
    "",
  ];
  return out.join("\n");
}

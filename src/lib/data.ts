import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { AXES, FIT_DOTS, SITE } from "./vocab";
import { mentionedLangs } from "./autolink.mjs";

export type Card = CollectionEntry<"cards">["data"];
export type Reason = { id: string; title: string; short: string; explain: string; sources: string[] };
export type Term = { id: string; term: string; aliases?: string[]; plain: string; source: string };

/** Why a language does not fit a slot, from data/reasons.yaml, in file order. */
export const REASONS: Reason[] = parse(readFileSync("data/reasons.yaml", "utf8"));
export const REASON = new Map(REASONS.map((r) => [r.id, r]));
/** The glossary, from data/terms.yaml, in file order. */
export const TERMS: Term[] = parse(readFileSync("data/terms.yaml", "utf8"));

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

let mentionIndex: Promise<Map<string, { mentions: string[]; mentionedBy: string[] }>> | undefined;
/** Which cards each card mentions, and which cards mention it (the Obsidian-style backlinks). */
export function mentions(): Promise<Map<string, { mentions: string[]; mentionedBy: string[] }>> {
  mentionIndex ??= (async () => {
    const cards = await allCards();
    const index = new Map(cards.map((c) => [c.id, { mentions: [] as string[], mentionedBy: [] as string[] }]));
    for (const c of cards) {
      const text = [
        c.tagline, c.born_from, c.tradeoffs.cost,
        ...c.slots.map((s) => s.note ?? ""), ...c.won_where.map((w) => w.what), ...c.timeline.map((e) => e.what),
        await proseBody(c.id),
      ].join("\n");
      for (const id of mentionedLangs(text)) {
        if (id === c.id) continue;
        index.get(c.id)!.mentions.push(id);
        index.get(id)?.mentionedBy.push(c.id);
      }
    }
    return index;
  })();
  return mentionIndex;
}

export function cardUrl(id: string, ext = ""): string {
  return ext ? `${SITE}/lang/${id}${ext}` : `${SITE}/lang/${id}/`;
}

/** The basics page as Markdown, with the reasons and the glossary. Served at /basics.md. */
export function basicsMarkdown(): string {
  const intro = readFileSync("data/basics.md", "utf8").trim();
  const reasons = REASONS.map((r, i) => `### ${i + 1}. ${r.title}\n\nid: \`${r.id}\`. ${r.explain}\n\nSources: ${r.sources.join(", ")}`);
  const terms = [...TERMS].sort((a, b) => a.term.localeCompare(b.term)).map((t) => `- **${t.term}**${t.aliases?.length ? ` (${t.aliases.join(", ")})` : ""}: ${t.plain} [source](${t.source})`);
  return [`# The basics: why there are so many programming languages`, "", intro, "", ...reasons.flatMap((r) => [r, ""]), "## Glossary", "", ...terms, "", "---", "Data: CC0, https://github.com/langwhy/langwhy/tree/main/data", ""].join("\n");
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
    line("Slots", card.slots.filter((s) => !s.reason).map((s) => `${s.slot} ${FIT_DOTS[s.fit]} ${s.fit}${s.note ? ` (${s.note})` : ""}`).join("; ")),
    line("Why not", card.slots.filter((s) => s.reason).map((s) => `${s.slot} ${FIT_DOTS[s.fit]} ${s.fit}, ${REASON.get(s.reason!)?.title ?? s.reason}: ${s.note} [source](${s.source})`).join("; ") || "–"),
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

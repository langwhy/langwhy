// The PLDB import (data/pldb/languages.json) and the sourced facts (data/facts/*.yaml): one page
// per PLDB entry, and the family tree built from influencedBy, successorOf, forkOf and the cards'
// reacts_to.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import type { Card } from "./data";
import { SITE } from "./vocab";

export type Pldb = {
  id: string; pldb: string; name: string; rank: number; appeared: number; type: string;
  creators?: string; aka?: string; lab?: string; country?: string; description?: string;
  website?: string; repo?: string; wikipedia?: string;
  influencedBy?: string[]; successorOf?: string[]; forkOf?: string[];
  fileExtensions?: string[]; openSource?: boolean; stars?: number; lastCommit?: number; usersEstimate?: number;
};
type Sourced<T> = { value: T; source: string; checked: string };
export type Quoted = { quote: string; source: string; checked: string };
export type Facts = {
  id: string; pldb: string; rank: number; card?: string;
  appeared?: Sourced<number>; creators?: Sourced<string[]>;
  born_from?: Quoted[]; trades_away?: Quoted[]; used_by?: (Quoted & { who: string })[];
};

export const PLDB: Pldb[] = JSON.parse(readFileSync("data/pldb/languages.json", "utf8"));
export const PLDB_BY_ID = new Map(PLDB.map((p) => [p.id, p]));
export const FACTS = new Map<string, Facts>(
  readdirSync("data/facts").filter((f) => f.endsWith(".yaml"))
    .map((f) => parse(readFileSync(`data/facts/${f}`, "utf8")) as Facts)
    .map((f) => [f.id, f]),
);

export const pldbUrl = (p: Pldb) => `https://pldb.io/concepts/${p.pldb}.html`;
export const pageUrl = (id: string, ext = "") => (ext ? `${SITE}/lang/${id}${ext}` : `${SITE}/lang/${id}/`);

// PLDB's primaryTag, in words.
const TYPE_WORDS: Record<string, string> = {
  pl: "programming language", esolang: "esoteric language", ir: "intermediate representation", isa: "instruction set",
  idl: "interface description language", os: "operating system", vm: "virtual machine", "3d": "3D format",
  plzoo: "language zoo", pldb: "PLDB", jsonFormat: "JSON format", xmlFormat: "XML format", yamlFormat: "YAML format",
};
export const typeWords = (t: string) => TYPE_WORDS[t] ?? t.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

/** Every edge of the family tree, child -> parents, with where it came from. */
export type Edge = { child: string; parent: string; via: "influencedBy" | "successorOf" | "forkOf" | "card" };
export function edges(cards: Card[]): Edge[] {
  const out: Edge[] = [];
  const add = (e: Edge) => { if (e.child !== e.parent && PLDB_BY_ID.has(e.parent) && !out.some((o) => o.child === e.child && o.parent === e.parent)) out.push(e); };
  for (const c of cards) for (const parent of c.reacts_to) add({ child: c.pldb ?? c.id, parent, via: "card" });
  for (const p of PLDB) for (const via of ["successorOf", "forkOf", "influencedBy"] as const) for (const parent of p[via] ?? []) add({ child: p.id, parent, via });
  return out;
}

/** Parents and children of one language in the tree. */
export function family(id: string, all: Edge[]) {
  return {
    parents: all.filter((e) => e.child === id).map((e) => ({ ...e, id: e.parent })),
    children: all.filter((e) => e.parent === id).map((e) => ({ ...e, id: e.child })),
  };
}

const firstName = (s?: string) => s?.split(/\s+and\s+/);

/** The JSON twin of a page without a card. Served at /lang/<id>.json. */
export function pldbJson(p: Pldb, all: Edge[]) {
  const f = FACTS.get(p.id);
  const { parents, children } = family(p.id, all);
  return {
    id: p.id,
    name: p.name,
    card: null,
    pldb: { ...p, url: pldbUrl(p) },
    facts: f ?? null,
    parents: parents.map((e) => ({ id: e.id, via: e.via })),
    children: children.map((e) => ({ id: e.id, via: e.via })),
    url: pageUrl(p.id),
    markdown: pageUrl(p.id, ".md"),
    note: "No langwhy card yet: the data comes from PLDB (pldb.io, CC0) and the facts from data/facts, each with its source. Nothing here is verified by a human.",
    license: "CC0-1.0",
  };
}

/** The Markdown twin of a page without a card. Served at /lang/<id>.md. */
export function pldbMarkdown(p: Pldb, all: Edge[]): string {
  const f = FACTS.get(p.id);
  const { parents, children } = family(p.id, all);
  const name = (id: string) => PLDB_BY_ID.get(id)?.name ?? id;
  const line = (label: string, value: string | number | undefined) => (value === undefined || value === "" ? [] : [`- **${label}:** ${value}`]);
  const quotes = (label: string, list?: Quoted[]) => (list?.length ? [`## ${label}`, "", ...list.map((q) => `- "${q.quote}" (${q.source}, checked ${q.checked})`), ""] : []);
  return [
    `# ${p.name}`,
    "",
    `No langwhy card yet. Data from PLDB: ${pldbUrl(p)}`,
    "",
    ...line("Type", typeWords(p.type)),
    ...line("Appeared", f?.appeared ? `${f.appeared.value} (${f.appeared.source})` : p.appeared),
    ...line("Creators", f?.creators ? `${f.creators.value.join(", ")} (${f.creators.source})` : firstName(p.creators)?.join(", ")),
    ...line("Lab", p.lab),
    ...line("Country", p.country),
    ...line("PLDB rank", p.rank),
    ...line("Description (PLDB)", p.description),
    ...line("Parents", parents.map((e) => `${name(e.id)} (${e.via})`).join(", ")),
    ...line("Children", children.map((e) => `${name(e.id)} (${e.via})`).join(", ")),
    ...line("File extensions", p.fileExtensions?.join(", ")),
    ...line("Website", p.website),
    ...line("Repository", p.repo),
    ...line("Wikipedia", p.wikipedia),
    "",
    ...quotes("Born from (quotes)", f?.born_from),
    ...quotes("Trades away (quotes)", f?.trades_away),
    ...(f?.used_by?.length ? ["## Used by (quotes)", "", ...f.used_by.map((u) => `- ${u.who}: "${u.quote}" (${u.source}, checked ${u.checked})`), ""] : []),
    "---",
    `Canonical: ${pageUrl(p.id)}. Data: CC0, PLDB and https://github.com/langwhy/langwhy/tree/main/data`,
    "",
  ].join("\n");
}

/** PLDB entries no card covers: each gets a page of its own. */
export function uncarded(cards: Card[]): Pldb[] {
  const carded = new Set(cards.map((c) => c.pldb ?? c.id));
  return PLDB.filter((p) => !carded.has(p.pldb));
}

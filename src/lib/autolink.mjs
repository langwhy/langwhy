// Wiki-style links without writing them by hand: any mention of a language that has a card links
// to that card, any glossary term links to /terms/. Used by the Markdown plugin (card stories,
// basics) and by `linkHtml` for the short text fields in the YAML. Plain JS so astro.config.mjs
// can import it.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// A name must stand on its own: "C" is not part of "Objective-C", "C++", "C#", "C99" or "PostgreSQL".
const BEFORE = "(?<![\\w+#.\\-])";
const AFTER = "(?![\\w+#])";

function regex(entries, flags) {
  if (!entries.length) return null;
  const alts = [...new Set(entries.map((e) => e.text))].sort((a, b) => b.length - a.length).map(escapeRe);
  return new RegExp(`${BEFORE}(?:${alts.join("|")})${AFTER}`, flags);
}

/** Builds a matcher from card names/aliases and glossary terms/aliases. */
export function buildDictionary(cards, terms) {
  const exact = new Map(); // case-sensitive: language names, all-caps term aliases
  const loose = new Map(); // case-insensitive: everything else, keyed lowercase
  for (const c of cards) {
    const entry = { kind: "lang", id: c.id, href: `/lang/${c.id}/`, title: c.tagline };
    for (const name of [c.name, ...(c.aliases ?? [])]) exact.set(name, { ...entry, text: name });
  }
  for (const t of terms) {
    const entry = { kind: "term", id: t.id, href: `/terms/#${t.id}`, title: t.plain };
    for (const name of [t.term, ...(t.aliases ?? [])]) {
      if (/[A-Z]/.test(name) && name === name.toUpperCase()) exact.set(name, { ...entry, text: name });
      else loose.set(name.toLowerCase(), { ...entry, text: name });
    }
  }
  return {
    exact, loose,
    exactRe: regex([...exact.values()], "g"),
    looseRe: regex([...loose.values()], "gi"),
  };
}

let cached;
/** The dictionary for this repo, read once per build from data/. */
export function dictionary(root = process.cwd()) {
  if (cached) return cached;
  const dir = join(root, "data", "languages");
  const cards = readdirSync(dir).filter((f) => f.endsWith(".yaml")).map((f) => parse(readFileSync(join(dir, f), "utf8")));
  const terms = parse(readFileSync(join(root, "data", "terms.yaml"), "utf8")) ?? [];
  cached = buildDictionary(cards, terms);
  return cached;
}

/** Every mention in `text`, left to right, longest match first, no overlaps. */
export function findMentions(text, dict) {
  const found = [];
  for (const [re, map, lower] of [[dict.exactRe, dict.exact, false], [dict.looseRe, dict.loose, true]]) {
    if (!re) continue;
    re.lastIndex = 0;
    for (let m; (m = re.exec(text)); ) {
      const entry = map.get(lower ? m[0].toLowerCase() : m[0]);
      if (entry) found.push({ start: m.index, end: m.index + m[0].length, entry });
    }
  }
  found.sort((a, b) => a.start - b.start || b.end - a.end);
  const out = [];
  let pos = 0;
  for (const f of found) if (f.start >= pos) { out.push(f); pos = f.end; }
  return out;
}

/**
 * Splits text into plain parts and links. `self` ("lang:rust", "term:gc") is never linked;
 * `seen` (a Set shared across one page) links each target only at its first mention.
 */
export function segments(text, dict, { self, seen } = {}) {
  const parts = [];
  let pos = 0;
  for (const { start, end, entry } of findMentions(text, dict)) {
    const key = `${entry.kind}:${entry.id}`;
    if (key === self || seen?.has(key)) continue;
    seen?.add(key);
    if (start > pos) parts.push({ text: text.slice(pos, start) });
    parts.push({ text: text.slice(start, end), href: entry.href, kind: entry.kind, title: entry.title });
    pos = end;
  }
  if (pos < text.length) parts.push({ text: text.slice(pos) });
  return parts;
}

/** HTML for a plain-text field with its mentions linked. Use with set:html. */
export function linkHtml(text, opts = {}, dict = dictionary()) {
  if (!text) return "";
  return segments(text, dict, opts)
    .map((p) => (p.href ? `<a class="${p.kind}" href="${p.href}" title="${escapeHtml(p.title ?? "")}">${escapeHtml(p.text)}</a>` : escapeHtml(p.text)))
    .join("");
}

/** Ids of the cards mentioned anywhere in `text`. */
export function mentionedLangs(text, dict = dictionary()) {
  return new Set(findMentions(text ?? "", dict).filter((f) => f.entry.kind === "lang").map((f) => f.entry.id));
}

const SKIP = new Set(["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style"]);

/**
 * Sätteri hast plugin (Astro 7's Markdown processor): links mentions in rendered Markdown, each
 * target once per document. A card's own story never links to its own card.
 */
export function autolinkPlugin() {
  return (doc) => {
    const own = (doc.fileURL ? fileURLToPath(doc.fileURL) : "").match(/data\/languages\/([^/]+)\.md$/);
    const opts = { self: own ? `lang:${own[1]}` : undefined, seen: new Set() };
    const dict = dictionary();
    return {
      name: "langwhy-autolink",
      text(node, ctx) {
        for (let p = ctx.parent(node); p; p = ctx.parent(p)) if (p.type === "element" && SKIP.has(p.tagName)) return;
        const parts = segments(node.value, dict, opts);
        if (!parts.some((part) => part.href)) return;
        ctx.replaceNode(node, parts.map((part) => part.href
          ? { type: "element", tagName: "a", properties: { className: [part.kind], href: part.href, title: part.title ?? "" }, children: [{ type: "text", value: part.text }] }
          : { type: "text", value: part.text }));
      },
    };
  };
}

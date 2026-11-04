// Downloads the source of every "Where it hurts in practice" item and checks that its quote is
// really on that page. Comparison ignores case, spacing, typographic quotes and dashes, so a quote
// copied from the rendered page matches the HTML. `node scripts/check-quotes.mjs` checks every
// card, `node scripts/check-quotes.mjs go rust` only those. Exit 1 when a quote is missing or a
// source can't be downloaded. Needs the network, so CI doesn't run it.
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "languages");
const only = process.argv.slice(2);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 langwhy-quote-check";

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "-", mdash: "-", hellip: "...", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', shy: "", "#39": "'" };
const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+|#39);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

/** Lowercase, one space, plain quotes and dashes: the form both sides are compared in. */
export const norm = (s) => s.normalize("NFKC")
  .replace(/[​-‍⁠﻿­]/g, "")
  .replace(/[‘’‚‛′`´]/g, "'")
  .replace(/[“”„‟″]/g, '"')
  .replace(/[‐-―−]/g, "-")
  .replace(/…/g, "...")
  .replace(/\s+/g, " ")
  .replace(/ ([.,;:!?)\]])/g, "$1")
  .replace(/([(\[]) /g, "$1")
  .trim()
  .toLowerCase();

/** The readable text of a page, plus a second version that keeps text from inline JSON (pages that render in the browser). */
function haystacks(html) {
  const visible = decode(html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " "));
  const embedded = decode(html.replace(/<[^>]+>/g, " ")).replace(/\\n/g, " ").replace(/\\"/g, '"').replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return [norm(visible), norm(embedded)];
}

function pdfText(buf) {
  const tmp = mkdtempSync(join(tmpdir(), "lw-pdf-"));
  try {
    writeFileSync(join(tmp, "a.pdf"), buf);
    return execFileSync("pdftotext", ["-layout", join(tmp, "a.pdf"), "-"], { encoding: "utf8", maxBuffer: 64 << 20 });
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

// Three tries: slow hosts (lua.org, isocpp.org) time out or drop the connection now and then.
async function download(url) {
  for (let attempt = 1; ; attempt++) {
    try { return await downloadOnce(url); } catch (e) {
      if (attempt === 3 || /^HTTP 4(?!29)/.test(e.message)) throw e;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

async function downloadOnce(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8" }, redirect: "follow", signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("pdf")) return [norm(pdfText(Buffer.from(await res.arrayBuffer())))];
  return haystacks(await res.text());
}

// `--find <url> <word>`: print the sentences on that page that contain the word, to copy a quote from.
if (only[0] === "--find") {
  const [, url, ...words] = only;
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(30_000) });
  if (!res.ok) { console.error(`HTTP ${res.status}`); process.exit(1); }
  const raw = (res.headers.get("content-type") ?? "").includes("pdf") ? pdfText(Buffer.from(await res.arrayBuffer())) : decode((await res.text()).replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " "));
  const sentences = raw.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/);
  for (const s of sentences) if (words.every((w) => norm(s).includes(norm(w)))) console.log(`- ${s.trim().slice(0, 400)}`);
  process.exit(0);
}

const items = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()) {
  const id = file.replace(/\.yaml$/, "");
  if (only.length && !only.includes(id)) continue;
  const card = parse(readFileSync(join(dir, file), "utf8"));
  (card.hurts ?? []).forEach((h, i) => items.push({ id, i, ...h }));
}

const pages = new Map();
const urls = [...new Set(items.map((h) => h.source))];
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < urls.length) {
    const url = urls[next++];
    try { pages.set(url, await download(url)); } catch (e) { pages.set(url, e); }
  }
}));

let missing = 0;
const perCard = new Map();
for (const h of items) {
  const page = pages.get(h.source);
  const where = `${h.id}.yaml hurts[${h.i}]`;
  let ok = false;
  if (page instanceof Error) console.error(`✗ ${where}: can't download ${h.source} (${page.message})`);
  else if (!(ok = page.some((text) => text.includes(norm(h.quote ?? ""))))) console.error(`✗ ${where}: quote not found on ${h.source}\n    "${h.quote}"`);
  if (!ok) missing++;
  const c = perCard.get(h.id) ?? { found: 0, total: 0 };
  c.total++; if (ok) c.found++;
  perCard.set(h.id, c);
}
for (const [id, c] of perCard) console.log(`${c.found === c.total ? "✓" : "✗"} ${id}: ${c.found}/${c.total} quotes found`);
console.log(`\n${items.length} quote(s) on ${perCard.size} card(s) from ${urls.length} source(s), ${missing} missing.`);
process.exit(missing ? 1 : 0);

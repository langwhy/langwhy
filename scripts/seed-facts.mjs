// Starts data/facts/<id>.yaml for the top languages by PLDB rank, with the year and the creators
// from PLDB (source: the PLDB concept page). Never overwrites: an existing file, or a field that is
// already filled, stays as it is, so a second run changes nothing. The pain, the trade-off and
// the users are added by hand or by an agent, each as a quote with its source.
// `node scripts/seed-facts.mjs` does the top 100; `node scripts/seed-facts.mjs 200` the top 200.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "facts");
const top = Number(process.argv[2] ?? 100);
const today = new Date().toISOString().slice(0, 10);
const pldb = JSON.parse(readFileSync(join(root, "data", "pldb", "languages.json"), "utf8"));
const cards = readdirSync(join(root, "data", "languages")).filter((f) => f.endsWith(".yaml"))
  .map((f) => parse(readFileSync(join(root, "data", "languages", f), "utf8")));
const cardFor = new Map(cards.filter((c) => c.pldb).map((c) => [c.pldb, c.id]));

mkdirSync(dir, { recursive: true });
let made = 0;
for (const p of [...pldb].sort((a, b) => a.rank - b.rank).slice(0, top)) {
  const id = cardFor.get(p.pldb) ?? p.id;
  const file = join(dir, `${id}.yaml`);
  if (existsSync(file)) continue;
  const source = `https://pldb.io/concepts/${p.pldb}.html`;
  const facts = { id, pldb: p.pldb, rank: p.rank };
  if (cardFor.has(p.pldb)) facts.card = id;
  if (p.appeared) facts.appeared = { value: p.appeared, source, checked: today };
  if (p.creators) facts.creators = { value: p.creators.split(/\s+and\s+/), source, checked: today };
  writeFileSync(file, stringify(facts, { lineWidth: 0 }));
  made++;
}
console.log(`${made} new facts file(s) in data/facts/`);

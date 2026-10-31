// Validates the data: every card in data/languages against the JSON Schema plus rules the schema
// can't express, the .md twin's three sections, data/reasons.yaml and data/terms.yaml.
// `node scripts/validate.mjs` checks everything; `node scripts/validate.mjs go rust` checks only
// those cards (the shared files are always checked). Exit 1 on any failure.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "languages");
const schema = JSON.parse(readFileSync(join(root, "data", "schema", "language.schema.json"), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const SLOTS = schema.properties.slots.items.properties.slot.enum;
const REQUIRED_HEADINGS = ["## Why it exists", "## What it trades away", "## Where it won"];
const MARKETING = /\b(modern|powerful|elegant|blazing(ly)?|robust|beloved|cutting-edge|next-generation)\b/i;
const isUri = (s) => typeof s === "string" && /^https?:\/\/\S+$/.test(s);

let failures = 0;
const fail = (file, msg) => { failures++; console.error(`✗ ${file}: ${msg}`); };
const load = (path, label) => {
  try { return parse(readFileSync(path, "utf8")); } catch (e) { fail(label, `YAML parse error: ${e.message}`); return null; }
};

// Shared files.
const reasons = load(join(root, "data", "reasons.yaml"), "reasons.yaml") ?? [];
const reasonIds = reasons.map((r) => r?.id);
const schemaReasons = schema.properties.slots.items.properties.reason.enum;
if (reasonIds.join() !== schemaReasons.join()) fail("reasons.yaml", `ids [${reasonIds}] must match the schema's reason enum [${schemaReasons}]`);
for (const r of reasons) {
  for (const k of ["id", "title", "short", "explain"]) if (typeof r?.[k] !== "string" || !r[k].trim()) fail("reasons.yaml", `${r?.id ?? "?"}: missing ${k}`);
  if (!Array.isArray(r?.sources) || !r.sources.length || !r.sources.every(isUri)) fail("reasons.yaml", `${r?.id}: needs at least one source URL`);
  const m = `${r?.short} ${r?.explain}`.match(MARKETING);
  if (m) fail("reasons.yaml", `${r.id} uses a marketing word: "${m[0]}"`);
}

const files = readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
const ids = new Set(files.map((f) => f.replace(/\.yaml$/, "")));
const names = new Map(); // every name and alias -> card id, to catch collisions

const termsPath = join(root, "data", "terms.yaml");
const terms = existsSync(termsPath) ? load(termsPath, "terms.yaml") ?? [] : [];
const termNames = new Map();
for (const t of terms) {
  for (const k of ["id", "term", "plain"]) if (typeof t?.[k] !== "string" || !t[k].trim()) fail("terms.yaml", `${t?.id ?? "?"}: missing ${k}`);
  if (!isUri(t?.source)) fail("terms.yaml", `${t?.id}: needs a source URL`);
  if (t?.aliases !== undefined && !(Array.isArray(t.aliases) && t.aliases.every((a) => typeof a === "string"))) fail("terms.yaml", `${t?.id}: aliases must be a list of strings`);
  for (const n of [t?.term, ...(t?.aliases ?? [])]) {
    const key = String(n).toLowerCase();
    if (termNames.has(key) && termNames.get(key) !== t.id) fail("terms.yaml", `"${n}" is used by both ${termNames.get(key)} and ${t.id}`);
    termNames.set(key, t.id);
  }
  const m = t?.plain?.match(MARKETING);
  if (m) fail("terms.yaml", `${t.id} uses a marketing word: "${m[0]}"`);
}
if (new Set(terms.map((t) => t?.id)).size !== terms.length) fail("terms.yaml", "duplicate ids");
if (!existsSync(join(root, "data", "basics.md"))) fail("basics.md", "missing");

// Cards.
const only = process.argv.slice(2);
for (const id of only) if (!ids.has(id)) fail(`${id}.yaml`, "no such card");
for (const file of files) {
  const id = file.replace(/\.yaml$/, "");
  const card = load(join(dir, file), file);
  if (!card) continue;
  for (const n of [card.name, ...(card.aliases ?? [])]) {
    if (names.has(n)) fail(file, `name "${n}" is also used by ${names.get(n)}`);
    names.set(n, id);
    if (termNames.has(String(n).toLowerCase())) fail(file, `name "${n}" collides with a glossary term`);
  }
  if (only.length && !only.includes(id)) continue;

  if (!validate(card)) for (const e of validate.errors) fail(file, `${e.instancePath || "/"} ${e.message}`);
  if (card.id !== id) fail(file, `id "${card.id}" must equal file name "${id}"`);
  const seen = (card.slots ?? []).map((s) => s.slot);
  const missing = SLOTS.filter((s) => !seen.includes(s));
  const twice = seen.filter((s, i) => seen.indexOf(s) !== i);
  if (missing.length) fail(file, `slots missing: ${missing.join(", ")} (answer all ${SLOTS.length})`);
  if (twice.length) fail(file, `slots listed twice: ${twice.join(", ")}`);
  const texts = { tagline: card.tagline, born_from: card.born_from, cost: card.tradeoffs?.cost };
  for (const s of card.slots ?? []) texts[`slots/${s.slot}`] = s.note;
  for (const [field, text] of Object.entries(texts)) {
    const m = text?.match(MARKETING);
    if (m) fail(file, `${field} uses a marketing word: "${m[0]}"`);
  }
  for (const ref of [...(card.reacts_to ?? []), ...(card.alternatives ?? [])]) {
    if (ref === id) fail(file, `references itself in reacts_to/alternatives`);
  }
  const mdPath = join(dir, `${id}.md`);
  if (!existsSync(mdPath)) { fail(file, `missing ${id}.md`); continue; }
  const md = readFileSync(mdPath, "utf8");
  for (const h of REQUIRED_HEADINGS) if (!md.includes(`\n${h}\n`) && !md.startsWith(`${h}\n`)) fail(`${id}.md`, `missing section "${h}"`);
  const headings = md.match(/^## .+$/gm) ?? [];
  if (headings.length !== 3) fail(`${id}.md`, `expected exactly 3 sections, found ${headings.length}`);
  const words = md.split(/\s+/).length;
  if (words < 150) fail(`${id}.md`, `too short (${words} words)`);
  if (!/\]\(https?:\/\//.test(md)) fail(`${id}.md`, `no inline source links`);
  const m = md.match(MARKETING);
  if (m) fail(`${id}.md`, `uses a marketing word: "${m[0]}"`);
}
const checked = only.length || files.length;
console.log(`${checked} card(s), ${reasons.length} reasons, ${terms.length} terms checked, ${failures} problem(s).`);
if (failures) process.exit(1);

// Validates every card in data/languages: YAML against the JSON Schema, the .md twin's three
// sections, and that ids referenced in reacts_to/alternatives are slugs. Exit 1 on any failure.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "languages");
const schema = JSON.parse(readFileSync(join(root, "data", "schema", "language.schema.json"), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const REQUIRED_HEADINGS = ["## Why it exists", "## What it trades away", "## Where it won"];
const MARKETING = /\b(modern|powerful|elegant|blazing(ly)?|robust|beloved|cutting-edge|next-generation)\b/i;

let failures = 0;
const fail = (file, msg) => { failures++; console.error(`✗ ${file}: ${msg}`); };
const files = readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
const ids = new Set(files.map((f) => f.replace(/\.yaml$/, "")));

for (const file of files) {
  const id = file.replace(/\.yaml$/, "");
  let card;
  try { card = parse(readFileSync(join(dir, file), "utf8")); } catch (e) { fail(file, `YAML parse error: ${e.message}`); continue; }
  if (!validate(card)) for (const e of validate.errors) fail(file, `${e.instancePath || "/"} ${e.message}`);
  if (card?.id !== id) fail(file, `id "${card?.id}" must equal file name "${id}"`);
  for (const field of ["tagline", "born_from"]) {
    const m = card?.[field]?.match(MARKETING);
    if (m) fail(file, `${field} uses a marketing word: "${m[0]}"`);
  }
  for (const ref of [...(card?.reacts_to ?? []), ...(card?.alternatives ?? [])]) {
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
console.log(`${files.length} cards checked, ${failures} problem(s).`);
if (failures) process.exit(1);

// Imports PLDB (pldb.io, github.com/breck7/pldb, CC0) into data/pldb/: languages.json keeps the
// few fields the site uses, one language per line, sorted by id; source.json pins the PLDB commit.
// `node scripts/import-pldb.mjs` re-imports the pinned commit, so a second run changes nothing.
// `node scripts/import-pldb.mjs --update` moves the pin to the newest PLDB commit first.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "data", "pldb");
const pinFile = join(out, "source.json");
const REPO = "breck7/pldb";

async function get(url, as = "json") {
  const res = await fetch(url, { headers: { "User-Agent": "langwhy-import-pldb" }, signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return as === "json" ? res.json() : res.text();
}

let commit = existsSync(pinFile) ? JSON.parse(readFileSync(pinFile, "utf8")).commit : undefined;
if (!commit || process.argv.includes("--update")) commit = (await get(`https://api.github.com/repos/${REPO}/commits/main`)).sha;

const pldb = await get(`https://raw.githubusercontent.com/${REPO}/${commit}/pldb.json`);
const words = (s) => (s ? String(s).split(/\s+/).filter(Boolean) : undefined);
const url = (s) => (typeof s === "string" && /^https?:\/\/\S+$/.test(s) ? s : undefined);

// PLDB ids may contain dots (asp.net); langwhy ids are [a-z0-9-], used in URLs and file names.
const slug = (id) => id.toLowerCase().replace(/[^a-z0-9-]/g, "-");
const ids = new Map(pldb.map((p) => [p.id, slug(p.id)]));
const taken = new Map();
for (const [id, s] of ids) {
  if (taken.has(s)) throw new Error(`PLDB ids ${taken.get(s)} and ${id} both become ${s}`);
  taken.set(s, id);
}
const refs = (s) => words(s)?.map((id) => ids.get(id) ?? slug(id));

const slim = (p) => {
  const e = {
    id: ids.get(p.id),
    pldb: p.id,
    name: p.name,
    rank: p.rank,
    appeared: p.appeared,
    creators: p.creators,
    type: p.primaryTag,
    aka: p.aka,
    lab: p.lab,
    country: p.country,
    description: p.githubRepo_description ?? p.description,
    website: url(p.website),
    repo: url(p.githubRepo) ?? url(p.mainRepo),
    wikipedia: url(p.wikipedia),
    influencedBy: refs(p.influencedBy),
    successorOf: refs(p.successorOf),
    forkOf: refs(p.forkOf),
    fileExtensions: words(p.fileExtensions ?? p.githubLanguage_fileExtensions),
    openSource: p.isOpenSource === undefined ? undefined : String(p.isOpenSource) === "true",
    stars: p.githubRepo_stars,
    lastCommit: p.repoStats_newestCommit,
    usersEstimate: p.numberOfUsersEstimate,
  };
  for (const k of Object.keys(e)) if (e[k] === undefined || e[k] === null || e[k] === "") delete e[k];
  return e;
};

const languages = pldb.map(slim).sort((a, b) => a.id.localeCompare(b.id));
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "languages.json"), "[\n" + languages.map((l) => JSON.stringify(l)).join(",\n") + "\n]\n");
writeFileSync(pinFile, JSON.stringify({
  source: `https://github.com/${REPO}`,
  file: `https://raw.githubusercontent.com/${REPO}/${commit}/pldb.json`,
  commit,
  license: "CC0-1.0",
  languages: languages.length,
}, null, 2) + "\n");
console.log(`${languages.length} languages from PLDB ${commit.slice(0, 7)} -> data/pldb/`);

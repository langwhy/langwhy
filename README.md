<img src="assets/icon.svg" width="48" height="48" alt="">

# langwhy

**Why every programming language exists, what it trades away, and where it won.**
[langwhy.dev](https://langwhy.dev)

There are thousands of programming languages and from the outside it looks like chaos. It is not.
Every language was built because something concrete hurt. langwhy is one card per language that
answers four questions, each claim with a source:

1. **Born from.** The pain that made someone build it: who, when, what was broken.
2. **Trades away.** Memory, types, run, concurrency, and what that choice costs you.
3. **Where it won.** Named deployments, not "many companies".
4. **Alive?** Status and timeline.

A language alone makes nothing, so every card also says which **slots** of a real product it can
fill (browser, server, database, systems, mobile, ...) and how well, with benchmark numbers where
they exist.

## How it works

- `data/languages/<id>.yaml` holds the facts, `<id>.md` the story. That is the whole database.
- `data/schema/language.schema.json` is the contract; `pnpm validate` enforces it.
- The site is generated from the data with Astro and served as static files from GitHub Pages.
- Every page has a JSON and a Markdown twin (`/lang/rust.json`, `/lang/rust.md`), plus
  `/llms.txt`, `/llms-full.txt` and `/api/v1/languages.json` for agents and tools.
- A card starts as a draft, often written by an agent from primary sources. It becomes `verified`
  only after a person checked every claim. Drafts are visible but `noindex`.

## Contribute

Edit or add files under `data/languages/` and open a pull request. The rules and the field
reference are in [data/README.md](data/README.md). CI validates the schema and builds the site.

```sh
pnpm install
pnpm validate   # check the cards
pnpm dev        # local site
pnpm build      # static site + search index in dist/
```

## License

Data under `data/` is public domain ([CC0](LICENSE-DATA)). Code is [MIT](LICENSE).
Facts are imported from and contributed back to [PLDB](https://pldb.io), also public domain.
Server benchmark numbers come from [arjaythedev](https://github.com/arjaythedev)'s challenges (MIT).

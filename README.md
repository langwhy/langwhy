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

A language alone makes nothing, so every card also answers all 13 **slots** of a real product
(browser, server, database, systems, mobile, ...): how well it fits, and where it does not, which
of seven reasons stops it, in words for someone who never programmed. Every language name and
technical term on the site links to its card or to the glossary on its own, like a wiki.

## How it works

- `data/languages/<id>.yaml` holds the facts, `<id>.md` the story. `data/reasons.yaml` (why a
  language does not fit a slot), `data/terms.yaml` (the glossary) and `data/basics.md` (the theory
  page) complete the database.
- `data/schema/language.schema.json` is the contract; `pnpm validate` enforces it.
- The site is generated from the data with Astro and served as static files from GitHub Pages.
- Every page has a JSON and a Markdown twin (`/lang/rust.json`, `/lang/rust.md`), plus
  `/llms.txt`, `/llms-full.txt` and `/api/v1/languages.json` for agents and tools.
- A card starts as a draft, often written by an agent from primary sources. It becomes `verified`
  only after a person checked every claim. Drafts are visible but `noindex`.

## Contribute

You don't need to know code. Every page links to a short form ("Tell us in your own words"):
say what is wrong, missing or hard to understand. A maintainer reads it and adds the `agent`
label, an AI agent drafts the fix with a source on a branch
([.github/workflows/agent.yml](.github/workflows/agent.yml)), and a person merges it.

To edit by hand, change or add files under `data/languages/` and open a pull request. The rules and the field
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

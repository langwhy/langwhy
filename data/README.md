# Language cards

One language = two files in `data/languages/`: `<id>.yaml` (facts) and `<id>.md` (the story).
`<id>` is a lowercase slug and becomes the URL `langwhy.dev/lang/<id>`.

Ids in use: `c`, `cpp`, `rust`, `zig`, `go`, `java`, `kotlin`, `csharp`, `python`, `javascript`,
`typescript`, `php`, `ruby`, `swift`, `dart`, `sql`, `bash`, `lua`, `haskell`, `elixir`.
Other ids you may reference before a card exists: `algol`, `bcpl`, `simula`, `smalltalk`, `lisp`,
`scheme`, `ml`, `ocaml`, `erlang`, `perl`, `fortran`, `cobol`, `pascal`, `modula`, `oberon`,
`objective-c`, `scala`, `clojure`, `fsharp`, `cyclone`, `self`, `hypertalk`, `awk`, `sh`, `ksh`,
`tcl`, `scheme`, `miranda`, `standard-ml`, `nim`, `d`, `crystal`, `julia`, `r`, `matlab`, `groovy`,
`visual-basic`, `delphi`, `vbscript`, `actionscript`, `coffeescript`, `flow`, `hack`, `prolog`.

## The four questions every card answers

1. **Born from**: the concrete pain that made someone build it. Name the people, the year, the
   place, the thing that was broken. Not "to be a better X", but what was wrong with X for them.
2. **Trades away**: what you pay for its strengths. The four axes in `tradeoffs` plus `cost`.
3. **Where it won**: real, named deployments with a source each (a company blog, a kernel
   changelog, a foundation announcement). Not "used by many companies".
4. **Alive?**: `status`, `timeline`, `links`.

## Rules

- English. Plain. No marketing words (modern, powerful, elegant, blazing, robust, beloved).
- Write for a layperson: someone curious who has never programmed. Prefer everyday words. A
  technical term is fine when `data/terms.yaml` explains it, because the site links it there.
- Write other languages' names exactly as their cards spell them (C++, C#, Go, JavaScript). The
  site links every mention to that card on its own; never add those links by hand.
- Every claim in `born_from`, `won_where` and `timeline` has a source URL. Prefer primary sources:
  the creator's own talk, mailing-list post, paper or interview; the official site; a release
  announcement. Wikipedia is fine as a second source, never the only one.
- What you cannot source, leave out. An empty field beats a guess.
- `tagline` says what it is for, in one sentence, no adjectives. Example: "Memory-safe systems
  programming without a garbage collector."
- `slots`: answer all 13 slots, each once, ordered strong, ok, weak, none. The slots and what
  they cover are listed below. A `strong` or `ok` slot may have a short `note`. A `weak` or
  `none` slot answers "why can't I use it for this?" with three fields:
  - `reason`: one id from `data/reasons.yaml` (runs-elsewhere, too-slow, hides-machine,
    too-risky, no-tools, one-job, overkill). Pick the one that decides it.
  - `note`: what is missing or in the way, in words a person who never programmed understands,
    at most 220 characters. Name the concrete thing: "Browsers run JavaScript and WebAssembly",
    not "limited browser support".
  - `source`: a page that states the note's claim. Write the note so the page backs it: say what
    the place uses or what the language needs, not "nobody uses X".
- `reacts_to`: the parents it reacted to or borrowed from, as ids. `alternatives`: what a person
  choosing it would weigh it against today.
- `timeline`: 3 to 8 events: first commit or paper, first release, 1.0, the moment it won a big
  deployment, a foundation or ownership change, a major version that changed the language.
- `verified: false` until a human has checked every claim against its source. `last_reviewed` is
  the date of that check or of writing.

## Slots

| Slot | What it covers |
|---|---|
| browser | Code that runs inside a web page. |
| server | The backend: web servers, APIs, the logic behind an app. |
| database | Storing data and asking it questions, including code that runs inside the database. |
| systems | Operating systems, drivers, compilers, language runtimes, anything close to the hardware. |
| mobile | Apps for phones, native or cross-platform. |
| cli | Command-line tools other people install and run. |
| scripts | Glue, automation and one-off jobs. |
| data | Analysis, statistics, notebooks, machine learning work. |
| compute | Heavy number crunching: GPU code, simulations, AI inference. |
| embedded | Microcontrollers and devices with kilobytes of memory. |
| wasm | Compiling to WebAssembly, in or outside the browser. |
| config | Settings files, build definitions, infrastructure as code (Terraform, Pulumi, Gradle). |
| games | Game engines and gameplay code. |

Fit: `strong` = a usual first pick, with named real use. `ok` = works and is used, but not the
first pick. `weak` = possible and rare, with a clear drawback. `none` = practically not done.

## The `.md` file

Exactly three sections, each one or two paragraphs, 60 to 150 words per section, with markdown
links to sources inline:

```markdown
## Why it exists

## What it trades away

## Where it won
```

Write for someone who has never used the language. The reader should finish knowing why it is
on the map and whether it is for them. See `rust.yaml` and `rust.md` for the reference card, and `python.yaml` for the slots.

## YAML gotchas

Write list items in block style, one key per line, and quote any string that contains a comma,
a colon or a `#`:

```yaml
won_where:
  - what: "Android, where new native code in Rust cut memory-safety bugs"
    source: https://security.googleblog.com/2022/12/memory-safe-languages-in-android-13.html
```

Flow style (`- { what: ..., source: ... }`) breaks on the first comma inside a value.

## Validate

```
pnpm validate            # everything
node scripts/validate.mjs go rust   # only these cards
```

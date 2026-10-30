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
- Every claim in `born_from`, `won_where` and `timeline` has a source URL. Prefer primary sources:
  the creator's own talk, mailing-list post, paper or interview; the official site; a release
  announcement. Wikipedia is fine as a second source, never the only one.
- What you cannot source, leave out. An empty field beats a guess.
- `tagline` says what it is for, in one sentence, no adjectives. Example: "Memory-safe systems
  programming without a garbage collector."
- `slots`: list the positions it can fill in a real product and how well. Include a `none` for the
  one place people wrongly expect it (Python in the browser, SQL on the server).
- `reacts_to`: the parents it reacted to or borrowed from, as ids. `alternatives`: what a person
  choosing it would weigh it against today.
- `timeline`: 3 to 8 events: first commit or paper, first release, 1.0, the moment it won a big
  deployment, a foundation or ownership change, a major version that changed the language.
- `verified: false` until a human has checked every claim against its source. `last_reviewed` is
  the date of that check or of writing.

## The `.md` file

Exactly three sections, each one or two paragraphs, 60 to 150 words per section, with markdown
links to sources inline:

```markdown
## Why it exists

## What it trades away

## Where it won
```

Write for someone who has never used the language. The reader should finish knowing why it is
on the map and whether it is for them. See `rust.yaml` and `rust.md` for the reference card.

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
pnpm validate
```

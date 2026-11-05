# F1 progress

Stav: rozrobené

Nočná úloha: `~/nocny-worker/ulohy/langwhy-f1.md`. Vetva `worker/langwhy-f1`, nič do `main`.

## Noc 1 (2026-11-05)

Začiatok 02:30. Relácia sa prerušila okolo 02:45 a stroj sa reštartoval. Zvyšok som dokončil
o 07:55, po termíne 05:30, preto len uloženie, nič nové.

Hotové:
- Bod 1: `scripts/import-pldb.mjs` stiahne `pldb.json` z pevného commitu breck7/pldb
  (`data/pldb/source.json`, teraz 8a70543) do `data/pldb/languages.json`, 5 166 hesiel, jeden
  riadok na jazyk. Druhý beh nič nezmení (sha1 súborov rovnaké). `--update` posunie pin na najnovší commit.
  ID s bodkou (`asp.net`) sa menia na pomlčku (`asp-net`) a kolízie zastavia import.
- Bod 6, časť: `data/schema/facts.schema.json` a `scripts/seed-facts.mjs`. Pre top 100 podľa PLDB rank
  je `data/facts/<id>.yaml` s rokom a autormi z PLDB (zdroj: stránka konceptu PLDB, dátum
  `checked`). Bolesť, čo obetoval a kto používa sú doslovné citácie so zdrojom, aby tam nebola
  naša próza. 20 jazykov s kartou má `card: <id>` a tieto polia dopĺňať netreba.
  Všetkých 100 súborov prejde schémou.
- `node scripts/check-quotes.mjs --facts [id…]` overí citácie vo faktoch na zdrojových stránkach.
- `pnpm validate` prejde. Kód webu sa nezmenil, `pnpm build` som túto noc nespúšťal.

Zistené:
- PLDB má `influencedBy` len pri 123 heslách, `successorOf` pri 5 a `forkOf` pri 3. Rust ho vôbec
  nemá. `/tree` preto bude riedky: spojiť ho s `reacts_to` z kariet a ukázať aj jazyky bez rodičov.
- Niektorí autori v PLDB sú sporní (Haskell: Paul Hudak a John Hughes, PostgreSQL: Marc G. Fournier).
  Vo faktoch sú so zdrojom PLDB a pri overovaní karty ich treba skontrolovať.

Ďalej (v tomto poradí):
1. Prepojiť `validate.mjs` so `facts.schema.json` a s kontrolou, že `data/pldb/languages.json`
   existuje.
2. HTML 20 kariet pred zmenou: spraviť `pnpm build` na tomto commite a odložiť `dist/lang/*/index.html`
   do scratchu.
3. `src/pages/lang/[id].astro`: getStaticPaths = karty + heslá PLDB bez karty (karta má prednosť cez pole
   `pldb`). Stránka z PLDB má `noindex`, štítok „Data from PLDB, no langwhy card yet“, fakty, rodičov,
   deti a odkazy. Karty nemeniť; autolink a odkazy v kartách nechať tak, aby HTML kariet ostalo rovnaké.
   Pridať `[id].json.ts` (a `.md`) aj pre heslá z PLDB. Zo sitemap vynechať všetko, čo nie je overená karta.
4. `/all`: 5 166 riadkov (meno, rok, typ), hľadanie Pagefind; stránky z PLDB indexovať.
   `/tree`: rodokmeň z `influencedBy`, `successorOf`, `forkOf` a `reacts_to`.
5. Build: pred ním `free -m`, aspoň 1 500 MB dostupných. Zapísať počet stránok, kB na stránku a čas.
   Spraviť snímky `/all` a `/tree` na desktope aj mobile.
6. Fakty pre 80 jazykov bez karty: dávky po 10 pre agentov, iba prvotné zdroje, bez Wikipédie;
   každú citáciu overí `check-quotes --facts`.

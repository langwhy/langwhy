# F1 progress

Stav: hotové

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

## Noc 2 (2026-11-06)

Začiatok 02:30, koniec okolo 03:00. Všetkých 7 bodov z `ulohy/langwhy-f1.md` je splnených.

1. Import: `node scripts/import-pldb.mjs` znova na pine 8a70543, `data/pldb/` bez zmeny.
2. `pnpm validate` prejde (20 kariet, 100 súborov faktov, 5 166 hesiel PLDB, 0 problémov). Validácia
   teraz kontroluje aj `facts.schema.json`, existenciu `data/pldb/languages.json`, unikátne id a to, že
   `pldb` z kariet aj faktov v PLDB existuje. `pnpm build` prejde: **5 166 stránok jazykov** v `dist/lang`,
   k tomu 5 166 `.json` a 5 166 `.md`. Pagefind zaindexoval 5 168 stránok.
3. Jazyk bez karty: `/lang/<id>/` z `src/components/PldbPage.astro`, `noindex`, štítok „Data from PLDB,
   no langwhy card yet“, citácie z faktov, rodina, čísla, odkazy. Karta: markup sa presunul do
   `src/components/CardPage.astro` bez zmeny. HTML všetkých 20 kariet (aj ich `.json` a `.md`) je pred
   zmenou a po nej **bajt po bajte rovnaké** (`cmp`, build na 51dedcc proti poslednému commitu).
   Sitemap obsahuje z `/lang/` len overené karty, teraz žiadnu.
4. `/all`: 5 166 riadkov podľa PLDB rank, hore karty a hľadanie Pagefind. `/tree`: 275 jazykov,
   345 väzieb (299 z PLDB, 46 z `reacts_to` kariet), vnorené zoznamy od najstarších koreňov, jazyk
   s dvoma rodičmi je druhýkrát len odkaz ↑. Snímky (desktop 1280 px, mobil 390 px) na asuse:
   `~/inbox/worker/langwhy-f1-shots/` (`all-*.png`, `tree-*.png`, `lang-erlang-*.png`). Do repa som
   ich nedal.
5. Výkon: stránka jazyka bez karty má 4,7 až 7,8 kB HTML (medián 5,2 kB), najväčšia karta (Rust)
   25,6 kB, žiadna nemá JS okrem klávesnice v layoute. `/all` má 550 kB HTML (77 kB gzip), `/tree`
   56 kB. Celý build (Astro + Pagefind) trvá **7 s**, z toho Astro 4,8 s a Pagefind 1,3 s; `dist` 105 MB
   (Pagefind 22 MB).
6. Fakty top 100: 20 jazykov s kartou má rok a autorov (zvyšok je v karte). Zo 80 bez karty má 73
   citácie: **226 citácií** (born_from 80, trades_away 70, used_by 76), všetky nájdené na zdroji
   (`node scripts/check-quotes.mjs --facts`: 0 chýba), bez Wikipédie. Bez citácie ostalo 7: groovy,
   tex, ini, matlab, spss, visual-basic-net, svg (zdroj chýba alebo vracia 403). Dva útržky z PDF
   (fortran, make) som vyhodil. Zbierali ich agenti po 10 jazykoch, každý overil svoje citácie,
   potom som všetky overil ešte raz naraz.
7. Vetva pushnutá, nič do `main`, žiadne PR.

Na rozhodnutie (nič neblokuje):
- V hlavnej navigácii nie je odkaz „Tree“, lebo by zmenil HTML všetkých kariet. `/tree` je zatiaľ
  prelinkovaný z `/all` a zo stránok jazykov bez karty.
- Niektoré citácie sú z druhej ruky, hoci na oficiálnom webe (napr. PayPal z oznámenia Node.js
  Foundation, XML z kópie na xml.coverpages.org, lebo w3.org vracia 403). Pri overovaní karty ich treba
  pozrieť.

## Doplnenie cez deň (2026-11-06, na Karchiho pokyn „dokonči, čo treba“)

- Fakty: zvyšných 7 jazykov (groovy, tex, ini, matlab, spss, visual-basic-net, svg) dostalo citácie.
  Teraz má **všetkých 80 jazykov bez karty 250 citácií** (born_from 86, trades_away 81, used_by 83),
  `check-quotes --facts`: 250 nájdených, 0 chýba. Citácie kariet: 63, 0 chýba.
- `check-quotes` pri HTTP 403 skúsi ešte jednoduchý user agent (w3.org odmieta agenta, ktorý sa tvári ako
  prehliadač). XML preto teraz cituje priamo w3.org, nie kópiu na xml.coverpages.org.
- V navigácii pribudol odkaz „Tree“. HTML každej z 20 kariet sa od stavu pred F1 líši len týmto
  jedným riadkom (`<a href="/tree/">Tree</a>`); `.json` a `.md` kariet sú rovnaké.
- `llms.txt` uvádza `/all` a `/tree`; `about` a `data/README.md` opisujú stránky z PLDB a `data/facts`.
- `.github/workflows/import-pldb.yml`: raz týždenne (pondelok 04:17 UTC) `import-pldb --update`. Keď sa
  dáta zmenili a `pnpm validate` aj `pnpm build` prejdú, commitne `data/pldb` do `main` a spustí deploy.
  Beží až po zlúčení do `main`; na vetve sa nedal vyskúšať, lebo ručné spustenie deploy.yml by nasadilo
  na Pages.
- Build po zmenách: 7,5 s (Astro 5,1 s, Pagefind 1,3 s), 5 166 stránok jazykov, medián 5,2 kB.
  Snímky prerobené s novou navigáciou.

Ostáva na kontrolu pri overovaní kariet (citácie sú z oficiálnych stránok, ale nie z prvej ruky):
PayPal pri Node.js (oznámenie Node.js Foundation; PayPal blog vracia 403), Pascal (Wirthov text
na zrkadle informatika-21.ru), TeX (Knuthov článok z kópie na umich.edu), Groovy (Strachanov blog cez
web.archive.org), SPSS (príspevok zamestnanca IBM, nie zakladateľov).

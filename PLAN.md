# langwhy: plán stavby

Stav: F0 v behu, 2026-10-30 (meno langwhy, org github.com/langwhy, doména langwhy.dev kúpené 2026-10-29). Autor plánu: Claude pre Karchiho. Verejný README bude po anglicky, tento plán je pracovný.

## 1. Čo staviame

Pokédex programovacích jazykov. Jedna karta na jazyk, ktorá odpovie na štyri otázky: z akej bolesti
sa narodil, čo za to obetoval, kde beží a kde vyhral, či ešte žije. Nad kartami tri pohľady: mapa
(začiatočník), rodokmeň (pokročilý) a stacky (beta). Cieľ: keď niekto uvidí na GitHube neznámy
jazyk, za minútu vie, čo to je, prečo existuje a či ho má riešiť.

Tri princípy, z ktorých vyplýva všetko ostatné:

1. **Git je databáza.** Každý jazyk je jeden súbor v repe. Web sa z nich len generuje. Žiadny
   server, žiadna databáza, žiadne prihlasovanie, žiadne cookies.
2. **Agent je prvý používateľ.** Každá stránka má dvojča v JSON a v Markdowne, web má `llms.txt`,
   repo sa dá naklonovať. Agenti karty aj píšu: nočná úloha drafty, človek schvaľuje.
3. **Moat sú dáta a história, nie texty.** Každý fakt má zdroj a dátum. Git história je audit.
   Dáta sú public domain (CC0), aby ich mohol prevziať každý vrátane vyhľadávačov a modelov, a aby
   sme boli kompatibilní s PLDB.

## 2. Ako stránka funguje

```
data/languages/rust.yaml      fakty, sloty, osi, zdroje        <- PR od ľudí a agentov
data/languages/rust.md        prečo vznikol, čo obetoval       <- ručne, krátke, so zdrojmi
data/stacks/t3.yaml           stack = výber na každé miesto    <- beta
data/pldb/                    cache importu z PLDB (CC0)       <- skript, týždenne
        |
        v  GitHub Actions: validácia schémy (JSON Schema) -> Astro build
        |
site/   -> HTML + /lang/rust.json + /lang/rust.md + sitemap.xml + llms.txt + OG obrázky
        |
        v  GitHub Pages (0 €), Cloudflare DNS pred tým; pri raste Cloudflare Pages
```

- **Build:** Astro, statický výstup. Stránka jazyka pod 50 kB bez JS. Vyhľadávanie Pagefind
  (statický index, beží v prehliadači, bez servera).
- **Prispievanie (2026-10-31):** človek nepíše YAML ani PR. Karchi: „všetko za nás robia agenti,
  nech to UI vyzerá jednoducho a viem sa dobre prihlásiť“. Na každej stránke je odkaz „Tell us in
  your own words“ na formulár na GitHube (prihlásenie GitHubom, účet sa dá založiť cez Google).
  Hlásenie prečíta človek a dá štítok `agent`. Agent (`.github/workflows/agent.yml`, Haiku) opraví
  kartu so zdrojom na vetve a človek zlúči PR. Ručný PR ostáva pre tých, čo vedia git. CI odmietne
  kartu bez povinných polí alebo bez zdroja. Neoverené karty majú `verified: false` a štítok
  „draft“.
- **Hosting:** GitHub Pages stačí roky. Limit je mäkkých 100 GB prenosu mesačne, stránka má
  desiatky kB, to je milióny zobrazení. Keby to nestačilo, Cloudflare Pages je tiež zadarmo
  a prepnutie je jedno nastavenie DNS.

## 3. Karta jazyka (dátový model)

```yaml
id: rust
name: Rust
appeared: 2010
creators: [Graydon Hoare]
org: Mozilla, od 2021 Rust Foundation
type: systems                      # typ = hlavná oblasť (jedna)
status: alive                      # alive | stable | declining | dead
born_from: >                       # jedna až tri vety, z akej bolesti vznikol
  C++ v jadre Firefoxu bolo nebezpečné a jazyky s GC príliš pomalé pre systémový kód.
reacts_to: [cpp, cyclone, ocaml]   # rodičia (evolúcia), z PLDB influencedBy + ručne
tradeoffs:                         # štyri osi, každá jedna hodnota z číselníka
  memory: ownership                # manual | gc | ownership | arena
  types: static                    # static | dynamic | gradual
  run: native                      # native | vm | interpreted | to-js
  concurrency: threads+async       # threads | green | actors | async | none
  cost: pomalý compile, strmá krivka učenia
slots:                             # ktoré miesta vie obsadiť (pozri §4)
  - {slot: server, fit: strong}
  - {slot: systems, fit: strong}
  - {slot: cli, fit: strong}
  - {slot: wasm, fit: strong}
  - {slot: browser, fit: none}
won_where: [Linux kernel, Cloudflare, AWS Firecracker, Android]
alternatives: [zig, cpp, go]
timeline:
  - {year: 2010, what: prvý commit, Graydon Hoare v Mozille, source: ...}
  - {year: 2015, what: 1.0, source: ...}
  - {year: 2022, what: prijatý do Linux kernelu, source: ...}
hardware:                          # §4, z benchmarkov, nie z názoru
  twelve_dollar_users: 264000      # arjaythedev, 1 vCPU / 2 GB, najlepší zápis
  multicore_users: 130000          # arjaythedev, 8 vCPU / 16 GB + Postgres
  gpu: via-libraries               # native | via-libraries | none
pldb: rust                         # kľúč do PLDB, odtiaľ fakty: repo, hviezdy, joby, balíky
sources: [...]
verified: true
last_reviewed: 2026-10-29
```

`rust.md` je próza: tri odseky „prečo vznikol“, „čo obetoval“, „kde vyhral“, každý s odkazom na
zdroj. Bez marketingu. Čo nie je v zdroji, nie je v karte.

## 4. Miesta (sloty) a prečo nie sú relatívne, keď k nim dáme čísla

Miesto = pozícia v produkte, ktorú treba obsadiť: `browser`, `server`, `database`, `systems`,
`mobile`, `cli`, `scripts`, `data` (analýza, ML), `compute` (GPU, AI inferencia), `embedded`,
`wasm`, `config` (infra ako kód), `games`.

„Hodí sa na server“ je relatívne, lebo závisí od troch vecí. Všetky tri zapíšeme explicitne,
namiesto toho, aby sme predstierali jednu odpoveď:

| Od čoho to závisí | Ako to zapíšeme | Odkiaľ dáta |
|---|---|---|
| Hardvér (jadrá, RAM, GPU) | číslo pri slote: koľko používateľov drží rovnaké API na rovnakom stroji, req/s, RAM MB, CPU % | arjaythedev `twelve-dollar-server-challenge` (1 vCPU / 2 GB, ~130 zápisov, ~30 jazykov, MIT, stĺpce req/s, p95, p99, CPU %, RAM MB) a `multicore-server-challenge` (8 vCPU / 16 GB + Postgres, 88 zápisov); TechEmpower (JSON); Benchmarks Game (CPU a pamäť na úlohu) |
| Éra (kedy to bolo štandard) | `era: 2005` pri stacku, `appeared` pri jazyku | PLDB, ručne |
| Tím (čo už vieš) | pohľad začiatočníka ukáže 15 diaľnic, pokročilý celý chvost | filter vo webe, nie v dátach |

Príklad, čo z toho vznikne na stránke `/slot/server` (čísla z multicore leaderboardu, rovnaké
API, rovnaký stroj):

| Jazyk | Najlepší zápis | Používateľov držal |
|---|---|---|
| Rust | epoll | 130 000 |
| Go | epoll | 120 000 |
| Node | uWebSockets | 86 000 |
| Python | uvloop | 46 000 |
| PHP | Symfony | 32 000 |
| Ruby | Rails | 10 000 |

To je odpoveď na „koľko jadier a ramky“: nehovoríme „Python je pomalý“, ukážeme, že na tom istom
stroji drží 3× menej ľudí ako Go, a človek si vyberie podľa svojho rozpočtu. GPU: slot `compute`
a pole `hardware.gpu`; do budúcnosti pribudne stĺpec s inferenciou (tokens/s na rovnakej karte),
keď bude verejný benchmark s rovnakou metodikou.

### Prečo nie (2026-10-31)

Karchi: „základná teória, prečo daný jazyk nemôžem použiť ako iný jazyk… je to pre lajkov“.
Každá karta preto odpovedá na všetkých 13 slotov. Slot so zhodou `weak` alebo `none` má
`reason` (jeden zo siedmich v `data/reasons.yaml`: nebeží tam, pomalý alebo ťažký, skrýva
stroj, ľahko sa pomýliť nebezpečne, nikto nepostavil nástroje, stavaný na jednu prácu, viac
než práca potrebuje), vetu pre laika a zdroj. Stránka `/basics/` vysvetľuje teóriu bez
programovania a pod každým dôvodom ukazuje skutočné príklady z kariet.

### Prelinkovanie ako wiki (2026-10-31)

Každá zmienka jazyka s kartou v hocijakom texte je odkaz na jeho kartu, každé odborné slovo
z `data/terms.yaml` je odkaz do slovníka `/terms/`. Odkazy nikto nepíše ručne, robí ich build
(`src/lib/autolink.mjs`), vždy pri prvej zmienke na stránke. Karta ukazuje aj „Mentioned on“,
teda ktoré karty ju spomínajú, a JSON karty má `mentions` a `mentioned_by`.

## 5. Stránky a SEO

| URL | Čo | Index |
|---|---|---|
| `/` | mapa: typy × 15 diaľnic pre začiatočníka, prepínač „všetko“ | áno |
| `/lang/<id>` | karta jazyka; dvojčatá `/lang/<id>.json` a `/lang/<id>.md` | áno, keď `verified`; inak `noindex` |
| `/slot/<slot>` | kto vie obsadiť miesto, zoradené podľa čísel z §4 | áno |
| `/compare/<a>-vs-<b>` | dvaja na rovnakom slote, obaja overení; generované z dát | áno, len tieto páry |
| `/tree` | rodokmeň (influencedBy, successorOf, forkOf z PLDB) | áno |
| `/stack/<id>` | stack = tabuľka miesto → výber, prečo sedia, kto to používa | beta, `noindex` kým nie je 10 stackov |
| `/all` | index všetkých 5 000+ z PLDB, jeden riadok na jazyk | áno |
| `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`, `/api/v1/*.json` | pre agentov a vyhľadávače | – |

Čo urobíme, aby sme boli vo výsledkoch (čo vieme ovplyvniť):
- Statické HTML, obsah bez JS, stránka pod 50 kB, Lighthouse 100 vo všetkých štyroch.
- Každá stránka: unikátny `<title>` v tvare „Rust: prečo vznikol a na čo je“, description, canonical,
  Open Graph obrázok generovaný z karty (pixel art), JSON-LD `schema.org/ComputerLanguage`.
- Hustá vnútorná sieť odkazov: rodičia, deti, alternatívy, sloty, stacky. Rodokmeň dá tisíce
  prirodzených odkazov, to vyhľadávače milujú.
- Žiadne tenké stránky: dlhý chvost z PLDB je `noindex`, kým karta nemá overené „prečo“.
  Päťtisíc prázdnych stránok by nás pochovalo.
- Google Search Console a Bing Webmaster od prvého dňa, sitemap odoslaná.
- Pre AI vyhľadávače (Perplexity, ChatGPT search, Google AI): `llms.txt`, Markdown dvojčatá, CC0
  licencia dát, aby nás citovali bez obáv.

Čo nevieme sľúbiť: „vždy vyjsť prvý“. Poradie sa buduje mesiace a rozhodujú spätné odkazy. Páka
je obsah, ktorý nikto iný nemá (prečo + čísla), a tri cielené miesta na štart: krížový odkaz
z PLDB (pošleme im PR s poľom na našu kartu), Show HN, awesome-listy.

## 6. Dizajn

Jednoduchý a použiteľný, podľa Karchiho vkusu:
- Jeden stĺpec, max 720 px, systémové písmo, monospace pre kód. Svetlý a tmavý režim podľa
  systému. Žiadne animácie.
- Pixel-art ikona 16×16 na každý typ jazyka (13 typov = 13 ikon), to je celá identita.
- Klávesnica: `/` hľadanie, `j`/`k` po zozname, Enter otvorí, Esc späť.
- Karta zhora nadol: meno + typ + stav; jedna veta; „narodil sa z“; štyri osi ako štyri štítky;
  „obsadí miesta“ s číslom; „kde vyhral“; evolúcia (odkazy na rodičov a deti); alternatívy; zdroje.
- Mobil prvý. Nič, čo sa nepoužíva, sa nerenderuje.

## 7. GitHub

- **Meno:** `langwhy` (vybrané 2026-10-30; `langwhy` na GitHube drží nečinný účet a GitHub mená
  neuvoľňuje). Organizácia github.com/langwhy, repo `langwhy/langwhy`.
- **Jedno repo** s `data/` a Astro webom v koreni. Dve licencie: dáta CC0 (`LICENSE-DATA`), kód MIT
  (`LICENSE`). Rozdelíme až keď bude mať `data/` vlastný život.
- **Actions:** `.github/workflows/deploy.yml`: na PR validácia a build; na `main` build + deploy na
  Pages. Týždenný import PLDB a leaderboardov príde vo F1/F3.
- **Issues:** formuláre `fix.yml` (niečo nesedí, nerozumiem, chýba) a `language.yml` (pridať
  jazyk), štítky `report`, `language`, `agent`. Discussions zapnúť.
- **Doména:** `langwhy.dev` kúpená 2026-10-29 na Cloudflare Registrar, DNS na Cloudflare, web na
  GitHub Pages (CNAME v `public/`, custom domain nastavená cez API).

## 8. Agenti

Čítanie: `llms.txt`, JSON a Markdown dvojčatá, naklonovateľné repo, neskôr MCP server s tromi
nástrojmi: `lookup(language)`, `compare(a, b)`, `stacks_for(language)`.

Písanie, nočná úloha na asuse (bez GPU, API model stačí, cena za kartu v halieroch):
1. Zdroje nových jazykov: diff PLDB, GitHub trending podľa jazyka, issue „navrhnúť jazyk“.
2. Agent stiahne README, Wikipediu a PLDB fakty, napíše draft karty v našom formáte, každé tvrdenie
   so zdrojom, inak pole nechá prázdne.
3. Otvorí PR s `verified: false`. Človek (Karchi alebo Claude v inom vlákne) skontroluje, opraví,
   zlúči. Na webe je draft viditeľný, ale `noindex` a so štítkom.
4. Mesačne agent prejde overené karty a navrhne zmeny stavu (žije / stagnuje / mŕtvy) podľa
   `lastActivity` z PLDB a GitHubu.

## 9. Fázy

| Fáza | Kedy | Čo je hotové | Ako spoznáme, že je hotová |
|---|---|---|---|
| **F0 Základ** | týždeň 1 | repo, schéma, 20 kariet ručne, Astro, Pages, Pagefind, `llms.txt`, sitemap, anglický README | web beží na GitHub Pages, Lighthouse 100/100/100/100, 20 kariet s `verified: true` |
| **F1 Kostra** | týždeň 2–3 | import PLDB (5 166 hesiel) do `data/pldb/`, `/all`, `/tree` z influencedBy, dlhý chvost `noindex` | každý jazyk z PLDB má URL a JSON, rodokmeň sa dá prechádzať |
| **F2 Agenti** | týždeň 3–4 | nočný drafter, PR tok, šablóny issues, top 100 overených ručne | 100 kariet `verified`, drafty prichádzajú samé |
| **F3 Čísla** | mesiac 2 | parser leaderboardov arjaythedev, TechEmpower, Benchmarks Game, `/slot/*`, pole `hardware` | `/slot/server` ukazuje reálne čísla so zdrojom a dátumom |
| **F4 Porovnania a štart** | mesiac 2–3 | `/compare`, OG obrázky, Search Console, PR do PLDB s odkazom, Show HN, awesome-listy | prvé organické návštevy v Search Console |
| **F5 Stacky (beta)** | mesiac 3+ | `data/stacks/`, `/stack/<id>`, 10 stackov (LAMP, MEAN, T3, Django, Rails, Laravel, Spring, .NET, Phoenix, Go + htmx), štítok beta | 10 stackov, každý s „prečo sedia“ a „kto používa“ so zdrojom |
| **F6 Nástroje** | mesiac 3+ | MCP server, „vlož GitHub URL“ (jazyky repa cez GitHub API → karty), verzované `/api/v1` | agent vie z URL repa dostať karty bez scrapovania |
| **F7 Komunita** | priebežne | contributor guide, kredit „overil“, mesačný changelog | PR od cudzích ľudí |

Prvých 20 kariet (F0): C, C++, Rust, Zig, Go, Java, Kotlin, C#, Python, JavaScript, TypeScript,
PHP, Ruby, Swift, Dart, SQL, Bash, Lua, Haskell, Elixir.

## 10. Náklady a hardvér

| Položka | Cena | Poznámka |
|---|---|---|
| Hosting | 0 € | GitHub Pages, CDN v cene |
| Doména | ~12 €/rok | langwhy.dev |
| Agent drafty | haliere za kartu | API model; 5 000 kariet je rádovo desiatky eur, jednorazovo |
| Nočná úloha | 0 € | asus, žiadne GPU |
| Build | 0 € | GitHub Actions, free tier stačí |

## 11. Riziká

- **Tenký obsah.** Jediná reálna hrozba. Rieši to prísny formát karty, `verified` a `noindex`.
- **Meno.** Pokédex je ochranná známka, používame len „langwhy“ a slovo „pokédex“ ako bežné
  slovo pre pohľad, nie v názve. Žiadne pokémon assety.
- **Čerstvosť.** Čísla z benchmarkov starnú. Každé má dátum a zdroj; týždenný import.
- **Licencie.** PLDB CC0, arjaythedev MIT (uviesť autora), TechEmpower a Benchmarks Game majú
  vlastné podmienky, citujeme, nekopírujeme kód. roadmap.sh obsah neberieme (copyright).

## 12. Rozhodnutia

Hotové 2026-10-30: meno langwhy, organizácia aj doména kúpené, dáta CC0, prvých 20 jazykov
podľa §9. 2026-10-31: publikum sú laici, ktorí nikdy neprogramovali; každá karta vysvetľuje,
prečo sa jazyk na niektoré sloty nehodí (§3, „Prečo nie“), texty sa prelinkujú samy. Ďalšie rozhodnutia idú do inboxu.

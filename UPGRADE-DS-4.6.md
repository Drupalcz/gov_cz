# Upgrade gov_cz: Design System 4.0.4 → 4.6.x — poznámky pro navazující ladění

Dokument shrnuje, co se při upgradu modulu změnilo, v čem se DS 4.6 zásadně
liší od 4.0.x a kde lze čekat rozbití na webech s vlastním tématem (custom
styly nad gov_cz). Slouží jako podklad pro ladění finálního tématu
v navazujícím projektu.

Stav: upgrade modulu je hotový a `npm run verify` prochází. Známé riziko:
**po nasazení se web vizuálně rozbije** — hlavně kvůli integrovanému dark
mode a přejmenovaným design tokenům, na které custom styly tématu nenavazují.

---

## 1. Co jsme v modulu změnili

### Verze balíčků (`package.json`)
- Všechny čtyři DS balíčky (`components`, `fonts`, `icons`, `styles`) →
  **4.6.4** (2026-07-02).
- Historie: styles byl dočasně pinnutý na 4.6.0, protože verze 4.6.2 a 4.6.3
  byly na npm publikovány rozbité (chybí `lib/components/*.css`, přestože je
  `exports` mapa deklaruje). Tarball 4.6.4 je opět kompletní (66 komponentových
  CSS, struktura shodná se 4.6.0), takže pin byl zrušen. Oproti 4.6.0 se
  změnily jen `tokens.css` (finální JVS paleta — `--color-primary-600` je
  oficiální vládní modrá `#00469B`, sémantické tokeny míří zpět na `-600`)
  a form komponenty checkbox/search/select.

### Copy pipeline + verifikace
- `npm run copy` nově končí krokem `npm run verify`
  (`dev-scripts/verify-assets.js`): projde `gov_cz.libraries.yml`, všechny
  `components/**/*.component.yml` a `source('@gov_cz/...')` reference v Twigu
  a selže s výpisem všech odkazů na neexistující soubory. Tohle je jádro
  „znovuopakovatelného" updatu — další breaking change v DS se projeví hned.

### Struktura assetů
- DS zploštil CSS komponent: dříve vnořené
  `gov-components/gov-accordion/gov-accordion-item.css`, nyní ploché
  `gov-components/gov-accordion-item.css` (66 souborů). Všechny cesty
  v `gov_cz.libraries.yml` a ve ~20 `*.component.yml` přepsány na ploché.
- **`assets/legacy/`** (nové, verzované v gitu, mimo copy pipeline) — od teď
  je udržuje tento modul, ne npm:
  - `gov-components/` — CSS deprecated komponent, které mají SDC: statsbar(-item),
    tiles (stav 4.0.4). Ostatní komponenty odebrané v DS 4.6 (app, nav(-item),
    side-nav(-item), modal, prompt) nedržíme — nic v gov_cz, csgov_theme ani
    csgov profilu je nepoužívá (rozhodnuto 2026-07-02).
  - `gov-icons/basic/` (149 SVG) + `complex/healthcare.svg` — odebrané ikony.
- Ikony v šablonách modulu přepnuty z `gov-icons/basic/` na
  `gov-icons/components/` (nová sada s ekvivalenty).

### Knihovny (`gov_cz.libraries.yml`)
- `base` nově načítá **`tokens.css` jako první** (veškeré DS 4.6 CSS stojí na
  jeho custom properties — bez něj je vše rozbité) a `animations.css`
  (keyframes se přesunuly z komponentového CSS sem).
- Nová knihovna **`gov_cz/legacy-tokens`** (závislost `base`): servíruje staré
  `--gov-*` tokeny z `assets/variables/_colors.css`, `_text.css`, `_misc.css`,
  aby dál fungovaly legacy komponenty a přepisy na úrovni webu.
- Nová knihovna **`gov_cz/theme-switch`** (2026-07-07): servíruje
  `gov-theme-switch.css` z DS. Jen CSS — samotný přepínač (SDC + JS) žije
  v csgov_theme; gov_cz zůstává lightweight integrace DS bez PHP/JS logiky.
  Upstream Stencil web-komponenta se nepoužívá (viz §2.5).

### Dark mode v legacy komponentách (2026-07-07)
Barevné **fallbacky** v `assets/legacy/gov-components/gov-statsbar.css`
a `gov-tiles.css` přemapovány ze starých `--gov-*` na sémantické tokeny DS 4.6
(`--background-primary-subtle`, `--text-primary-color`,
`--background-block-primary`, `--text-white-fixed`, `--border-subtlest`,
pevná `--color-neutral-900` pro secondary variantu) — statsbar/tiles tak nově
flipují v dark mode. Přepisové proměnné (`--gov-statsbar-*`, `--gov-tiles-*`)
zůstávají zachované jako veřejné API.

### SDC
- Žádné SDC nebylo odebráno (zpětná kompatibilita — názvy komponent a knihoven
  jsou veřejné API). Deprecated SDC (`gov-statsbar`, `gov-statsbar-item`,
  `gov-tiles`) mají v `libraryOverrides` CSS z `assets/legacy/` + potřebné
  soubory s `--gov-*` proměnnými z `assets/variables/`. Plán: časem nahradit
  (tiles → grid).

---

## 2. Zásadní rozdíly v implementaci DS 4.0 → 4.6

### 2.1 Kompletně přejmenované design tokeny (největší breaking change)

DS 4.0.x měl jednu plochou vrstvu `--gov-*` proměnných
(`--gov-color-primary`, `--gov-text-color`, `--gov-border-radius`, …).

DS 4.6 má **dvouvrstvý systém bez prefixu `gov-`**, definovaný výhradně
v `gov-styles/tokens.css`:

1. **Primitivní paleta** v `:root` (~80 tokenů):
   `--color-{primary|secondary|neutral|error|success|warning|focus|visited}-{50…1050}`.
2. **Sémantické tokeny** (~122 tokenů): `--background-*`, `--text-*`,
   `--border-*`, `--icon-*`, `--button-*`, `--interactive-*`, `--status-*`,
   `--photo-*`. Ty odkazují na paletu, např.
   `--background-page: var(--color-neutral-50)`,
   `--background-primary: var(--color-primary-600)`.
   **Sémantické tokeny jsou definované jen uvnitř theme bloků** (viz dark
   mode níže), ne v `:root`.

Důsledky:
- Žádné `--gov-*` v novém CSS neexistuje. Veškeré přepisy `--gov-*`
  v custom tématech **nemají na nové DS komponenty žádný vliv** — tiše se
  ignorují. To je pravděpodobně hlavní zdroj „nesedí to s custom styly".
- **Změnily se i samotné hodnoty barev** (rebrand), takže ani mechanický
  převod názvů nedá pixel-perfect shodu. Příklad: stará
  `--gov-color-primary` = `#2362a2`, nová `--color-primary-600` =
  `rgb(46, 106, 168)` ≈ `#2e6aa8`; nová značková modř je
  `--color-primary-700` = `rgb(0, 70, 155)`.
- V tématu přepisovat přednostně **sémantické tokeny** (např.
  `--background-primary`, `--text-primary`), ne paletu — sémantické se
  propisují do komponent a respektují dark mode.

Orientační mapování nejčastějších tokenů (hodnoty ≠ identické!):

| DS 4.0 (`--gov-*`)        | DS 4.6 (nejbližší ekvivalent)                  |
|---------------------------|------------------------------------------------|
| `--gov-color-primary`     | `--color-primary-600` / sém. `--background-primary`, `--border-primary` |
| `--gov-color-primary-NNN` | `--color-primary-NNN` (jiné odstíny, škála jde do 1050) |
| `--gov-color-secondary`   | pozor: „secondary" je v 4.6 **žlutá** (`--color-secondary-*`); stará šedá ≈ `--color-neutral-*` |
| `--gov-color-error/success/warning` | `--color-{error|success|warning}-600` / `--status-*` |
| `--gov-text-color`        | `--text-primary` (= `--color-neutral-950`)     |
| pozadí stránky            | `--background-page` (= `--color-neutral-50`)   |
| bílá / povrchy            | `--background-white`, `--background-neutral-*` |

### 2.2 Integrovaný dark mode (důvod „rozbití" po nasazení)

`tokens.css` definuje sémantické tokeny ve čtyřech blocích:

```css
[data-theme=light] { …světlé hodnoty… }
@media (prefers-color-scheme: light) {
  html:not([data-theme]), html[data-theme=auto] { …světlé hodnoty… }
}
[data-theme=dark] { …tmavé hodnoty… }
@media (prefers-color-scheme: dark) {
  html:not([data-theme]), html[data-theme=auto] { …tmavé hodnoty… }
}
```

Klíčové: **když `<html>` nemá atribut `data-theme`, web se automaticky řídí
nastavením OS** (`prefers-color-scheme`). Uživatel s tmavým systémem tedy
dostane tmavé DS komponenty, zatímco custom styly tématu (pevné barvy,
pozadí, obrázky) zůstanou světlé → rozbitý mix. Přesně tohle se děje teď.

Strategie pro finální téma (vybrat jednu):
1. **Vynutit light**: `<html data-theme="light">` (v Drupalu přes
   `hook_preprocess_html()` / `html.html.twig` — `attributes.setAttribute()`).
   Nejrychlejší oprava, návrat k chování 4.0.x.
2. **Podporovat dark mode pořádně**: custom styly tématu převést na
   sémantické tokeny DS (žádné natvrdo zapsané barvy) a případně nasadit
   novou komponentu `gov-theme-switch` (light/dark/auto, zapisuje
   `data-theme`). Větší práce, ale dlouhodobě správně.

Pozn.: dark hodnoty flipují 122 sémantických tokenů (`--background-*`,
`--text-*`, `--border-*`, `--icon-*`, `--button-*`, `--interactive-*`,
`--status-*`, `--photo-*`). Primitivní paleta v `:root` se nemění.

### 2.3 Vizuální redesign

4.0 → 4.6 není jen technický update, je to **redesign**: jiné odstíny barev,
typografie, spacing, focus stavy. `styles.css` dál styluje h1–h6/p, ale podle
nových tokenů. I po vyřešení dark mode a tokenů je nutná vizuální kontrola
všech komponent — nepůjde o shodu 1:1 a část přepisů v tématu může být
postavená na konkrétních hodnotách/selektorech, které už neplatí.

### 2.4 Struktura souborů a načítání

- Per-komponentové CSS: vnořené složky → ploché soubory
  (`lib/components/gov-*.css`); `components.css` je jejich přesná konkatenace.
- `tokens.css` je nový a **musí se načíst před vším ostatním DS CSS** —
  v modulu vyřešeno v `gov_cz/base`. Pokud finální téma přidává DS CSS
  vlastní cestou (agregace, critical CSS, kopie souborů), musí tokens
  zachovat jako první.
- Keyframes přesunuté do `animations.css` (také v `base`).
- Ikony: sada `basic/` zrušena, náhrady v `components/` (42 SVG); názvy se
  místy liší. Weby odkazující přímo na `basic/*.svg` obslouží
  `assets/legacy/gov-icons/basic/`.

### 2.5 Odebrané a nové komponenty

- **Odebrané v 4.6** (v modulu drženy jako legacy/deprecated): gov-app,
  gov-modal, gov-nav(-item), gov-prompt, gov-side-nav(-item),
  gov-statsbar(-item), gov-tiles.
- **Nové v 4.6** (zatím nepřidány, zvážit potřebnost): avatar, badge, banner,
  blockquote, collapsible, **dialog** (náhrada modal/prompt), flex,
  form-range, horizontal-stepper, link, user-navigation, attribute-section.
- **theme-switch** (2026-07-07): CSS servíruje nová knihovna
  `gov_cz/theme-switch`; SDC + JS implementuje csgov_theme (třícestný toggle
  light/dark/reset-na-auto, localStorage). Upstream Stencil web-komponenta
  zavržena: vyžaduje Stencil runtime, je jen dvoustavová a persistuje do
  session cookie — neumí reset na auto.

### 2.6 Koexistence starých a nových tokenů

`gov_cz/legacy-tokens` drží staré `--gov-*` definice (z `assets/variables/`),
nové DS CSS čte jen nové názvy z `tokens.css` — obě sady koexistují bez
konfliktu. Ale pozor na asymetrii:

- staré `--gov-*` přepisy ovlivní **jen** legacy komponenty
  (statsbar, tiles, …) a vlastní styly webu, které je čtou;
- nové DS komponenty ovlivní **jen** přepisy nových tokenů;
- legacy tokeny **nereagují na dark mode** — legacy komponenty zůstanou
  v dark mode světlé (další zdroj vizuálního mixu).

---

## 3. Checklist pro ladění ve finálním tématu

1. **Dark mode**: rozhodnout strategii (viz 2.2). Pro rychlou stabilizaci
   nasadit `data-theme="light"` na `<html>` a dark mode řešit samostatně.
2. **Inventura tokenů v tématu**:
   `grep -rE -- '--gov-[a-z0-9-]+' <theme>/` — každý výskyt buď přemapovat na
   nový token (tabulka v 2.1), nebo vědomě nechat (týká se jen legacy
   komponent).
3. **Natvrdo zapsané barvy/hodnoty** v tématu, které měly ladit s DS
   (`#2362a2` apod.) — už nesedí na nový brand; nahradit sémantickými tokeny.
4. **Pořadí CSS**: ověřit, že `tokens.css` (knihovna `gov_cz/base`) se na
   webu opravdu načítá před DS komponentami i před styly tématu, včetně
   zapnuté agregace.
5. **Vizuální průchod** všech použitých komponent (light i dark, pokud se
   dark ponechá) — redesign mění odstíny, spacing, focus i typografii.
6. **Selektorové přepisy** v tématu (přepisy `.gov-*` tříd) — markup kontrakt
   drží (třídy užívané šablonami modulu v 4.6 existují), ale interní
   struktura/specificita stylů se měnit mohla; projít DevTools tam, kde
   přepis „přestal fungovat".
7. **Legacy komponenty** (statsbar, tiles): počítat s tím, že vizuálně
   zůstávají ve stylu 4.0 a v dark mode se nepřepnou; plánovat náhradu
   (tiles → grid/flex).
8. **Upstream**: nahlásit rozbité publikace styles@4.6.2/4.6.3 (chybějící
   `lib/components/*.css`) do repozitáře design systému. Pozn. 2026-07-02:
   4.6.4 už je publikovaná správně, hlášení má smysl hlavně proto, aby se
   rozbité verze stáhly/deprecatovaly.

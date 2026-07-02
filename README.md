# Implementation of [Design system gov.cz](https://designsystem.gov.cz)

This module brings the styles and components made in DesignSystem v 4 into Drupal 11.

## For developers

* We are using single directory components (SDC)
* In your Drupal template of your theme you can use SDC in following manner.
```
{% include "gov_cz:[component-name]" with {
  component_variable_1: drupal_variable_1,
  component_variable_2: drupal_variable_2,
} %}
```
The npm scripts is only needed while developing the gov_cz module directly.
For normal use, all the necesary files are already included.

## Updating the design system

The design system assets are copied from the `@gov-design-system-ce/*` npm
packages into `assets/gov-design-system/`. To upgrade to a newer DS release:

1. Bump the package versions in `package.json` (see the pinning note below).
2. Run `npm install && npm run copy`.
3. The copy pipeline ends with `npm run verify`, which checks that every CSS,
   JS and SVG file referenced from `gov_cz.libraries.yml`, the SDC
   `*.component.yml` files and the Twig templates exists on disk. If the DS
   removed or renamed files, verify fails and lists every broken reference —
   fix the references (or move the old files to `assets/legacy/`, see below)
   before committing.
4. Review the git diff of `assets/` for unexpected changes and test the
   components visually.

### Version pinning

DS packages are pinned to exact versions on purpose — npm has shipped broken
tarballs before: `@gov-design-system-ce/styles` 4.6.2 and 4.6.3 were published
without the per-component `lib/components/*.css` files (their `exports` map
still declares them); 4.6.4 is complete again. When upgrading, check that the
new version ships `lib/components/` before bumping (`npm run verify` catches
any missing referenced file after `npm run copy`).

### Legacy assets (`assets/legacy/`)

DS 4.6 removed some components and the whole `icons/basic` set. Because this
module must stay backward compatible, the last shipped 4.0.x versions are kept
in `assets/legacy/` (maintained by this module from now on, excluded from the
copy pipeline):

* `gov-components/` — CSS for **deprecated** components that still have an SDC
  here: `gov-statsbar`, `gov-statsbar-item`, `gov-tiles`. Plan their
  replacement (e.g. tiles → grid). Other components removed by DS 4.6
  (`gov-app`, `gov-nav`, `gov-side-nav`, `gov-modal`, `gov-prompt`) are not
  kept — nothing in gov_cz, csgov_theme or the csgov profile uses them.
* `gov-icons/basic/` — the removed icon set. The module's own templates now
  use `gov-icons/components/`, which contains the equivalents.

DS 4.6 also renamed all design tokens (old `--gov-*` names are gone). The
`gov_cz/legacy-tokens` library (a `gov_cz/base` dependency) keeps the old
token definitions from `assets/variables/` available so legacy components and
site-level overrides keep working. The new DS CSS reads only the new token
names from `gov-styles/tokens.css`, so both token sets coexist safely.

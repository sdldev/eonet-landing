# ASYNC Research: Codebase Analysis

## Project summary

EONET landing page is a single-page Indonesian marketing site for internet packages: visitors compare packages, learn installation/coverage flow, then contact EONET through WhatsApp CTAs. Project uses Astro components with plain CSS, strict Astro TypeScript config, public static assets, and Cloudflare adapter/Wrangler deployment config.

## Research scope and relevant files examined

Because requested task is whole-codebase analysis and improvement recommendations, all project files relevant to runtime, build, deploy, editor conventions, and page content were examined.

### Documentation and repository state

- `README.md` — still mostly Astro starter README; documents local commands, build, preview, and Cloudflare Wrangler dry-run flow.
- `CLAUDE.md` — untracked local project guidance found in working tree. Gives most useful domain summary, directory map, content conventions, accessibility notes, and known package JSON trailing-comma warning.
- `.gitignore` — ignores build output, generated Astro types, dependencies, environment files, IDE/session artifacts, and test artifacts.
- Git file list/status/history — tracked tree is small and has no `.github` workflow files. `CLAUDE.md` was already untracked before research. Current branch is `main` at `origin/main`.

### Build, type, and deployment config

- `package.json` — npm scripts and declared dependencies. Important because it currently has trailing commas and does not match lockfile dependency set.
- `package-lock.json` — lockfile root entry includes `astro` and `wrangler` in addition to `@astrojs/cloudflare`; useful for detecting manifest drift.
- `astro.config.mjs` — Astro entry config; imports and enables `@astrojs/cloudflare` adapter.
- `tsconfig.json` — extends `astro/tsconfigs/strict`, includes Astro generated types and project files, excludes `dist`.
- `wrangler.jsonc` — Cloudflare project name `eonet`, compatibility date/flag, assets binding, observability object.
- `.vscode/extensions.json` and `.vscode/launch.json` — recommends Astro VS Code extension and provides dev-server launch command.

### Application entry points and architecture

- `src/pages/index.astro` — only file-based route and composition entry point. Imports layout and all sections.
- `src/layouts/Layout.astro` — document shell, global CSS import, HTML language, metadata, favicon, generator meta, slot, and fixed page background.
- `src/styles/global.css` — design tokens, reset/base typography, shared layout utilities, button/panel/section classes, responsive token adjustments, focus styles, and reduced-motion rule.

### Section components

- `src/components/Header.astro` — fixed header, logo, anchor navigation, contact CTA, mobile nav behavior.
- `src/components/Hero.astro` — `#home` section, main proposition, WhatsApp CTA, static hero image, responsive hero layout.
- `src/components/Packages.astro` — package data, FAQ data, per-package WhatsApp message construction, package cards, package details, FAQ block, package section styling.
- `src/components/Features.astro` — `#features` trust/coverage feature cards and SVG icons.
- `src/components/Footer.astro` — `#contact` final WhatsApp CTA, brand footer, copyright.

### Static assets

- `public/eonet.avif` — hero image served from site root.
- `public/favicon.svg` and `public/favicon.ico` — favicon assets used/fallback-ready from public root.
- `public/.assetsignore` — public asset control file.

## Architecture map

```text
/
├── public/                  # static root assets
├── src/
│   ├── components/          # page sections
│   ├── layouts/             # document shell
│   ├── pages/               # Astro route entry points
│   └── styles/              # global CSS/design system
├── astro.config.mjs         # Astro + Cloudflare adapter config
├── tsconfig.json            # strict Astro TS config
├── wrangler.jsonc           # Cloudflare config
├── package.json             # npm scripts/dependencies
└── package-lock.json        # resolved dependency graph
```

Runtime flow:

1. Astro routes `/` from `src/pages/index.astro`.
2. `index.astro` wraps content with `Layout`.
3. `Layout.astro` imports global CSS and renders shared HTML/background shell.
4. `Header`, `Hero`, `Packages`, `Features`, and `Footer` render static landing sections.
5. In-page navigation uses section IDs: `#home`, `#packages`, `#features`, `#contact`.
6. Conversion flow exits through `wa.me` links; `Packages.astro` builds package-specific messages with `encodeURIComponent`.

## Patterns and conventions identified

### Astro and file organization

- File-based routing under `src/pages/`; page entry currently composition-only.
- Shared document concerns live in layout, not in each section.
- Marketing sections are separate `.astro` components under `src/components/`.
- Components use Astro frontmatter when imports or data are needed, then static markup and component-scoped `<style>` blocks.
- No shared TypeScript modules or content collections exist yet; package/FAQ data is intended to live near package rendering.

### Styling

- Plain CSS only. No Tailwind, CSS modules, Sass, or component library config present.
- `src/styles/global.css` defines design tokens (`--space-*`, colors, radius, shadows, transition values) and reusable classes like `container`, `btn`, `surface-panel`, `section`, section headings, and eyebrow copy.
- Component styles reference global custom properties and scoped class selectors.
- Responsive styling uses component media queries plus global breakpoint token adjustments.
- Dark palette is explicit through `color-scheme: dark` and page background layers.
- Reduced-motion handling exists globally.

### Markup/content

- Copy is Indonesian with some small English brand/eyebrow text.
- CTA path is WhatsApp. Hero and footer URLs are literal encoded URLs; package card CTA message is generated from package data.
- Navigation is hash-anchor based. Shared section scroll margin compensates for fixed header.
- SVG icons are inline. Hero image uses public-root URL and alt text.
- External WhatsApp links use `target="_blank"` and `rel="noreferrer"` in examined CTAs.

### Naming/import conventions

- Astro component files use PascalCase names.
- CSS class names use kebab-case and section-prefixed names when scope matters (`hero-title`, `package-card`, `footer-contact`).
- Imports use double quotes in `.astro` page/layout files; config uses single quotes.
- Indentation varies: Astro components mostly use four spaces, global CSS uses two spaces. Future edits should follow local file style or add formatter config first.

### Error handling and state

- Site is mostly static and has no fetch/API/form submission logic, so there is no visible runtime error-handling pattern.
- User handoff relies on third-party WhatsApp URL availability. No analytics, click tracking, status message, or fallback contact path appears in code.

## Constraints found

### Build/deploy validation

- Available scripts in `package.json`: `dev`, `build`, `preview`.
- README documents expected validation commands:
  - `npm run build`
  - `npx wrangler deploy --config dist/server/wrangler.json --dry-run` after build
- Astro uses Cloudflare adapter, so generated worker/server output and `wrangler.jsonc` compatibility settings matter.
- Strict TypeScript config applies once Astro tooling can parse/check source.

### Tests, lint, formatting, CI

- No test script, test directory, unit/E2E framework, snapshot tests, lint script, type/check script, ESLint config, Prettier config, Stylelint config, or CI workflow was found.
- `.gitignore` includes `test-results/`, but no test runner config is present.
- Editor recommendation exists for Astro syntax support only.
- Validation currently depends mainly on install/build/manual browser review unless new quality gates are added.

### Current validation blockers and code health observations

- Running `npm run build` during research failed in current checkout with:

  ```text
  sh: 1: astro: not found
  ```

  `node_modules` is absent, and `package.json` does not declare `astro` even though lockfile root entry does.
- `package.json` contains trailing commas after script/dependency entries. It is not valid strict JSON (`JSON.parse` fails). README/`CLAUDE.md` already hint at this issue.
- `package.json` and lockfile root package metadata are out of sync: lockfile lists `astro` dependency and `wrangler` dev dependency but manifest currently lists only `@astrojs/cloudflare`.
- Several source files appear structurally malformed in tracked checkout:
  - `src/components/Packages.astro` lacks an opening frontmatter fence and has FAQ objects with string literals missing an `answer:` key; markup/style sections also appear to have missing tags/declarations.
  - `src/components/Hero.astro` has CSS blocks/media query blocks missing closing braces near image glow/responsive styling.
  - `src/components/Features.astro` has CSS media query/style closure problems near end.
  - `src/styles/global.css` shows multiple selectors/media blocks with missing declaration bodies or closing braces in later sections.
- These malformed sources are high-priority findings: after dependency/manifest repair, Astro/CSS parse or render failures are likely until syntax is restored.

## Improvement recommendations

### Priority 0: restore buildable baseline

1. Make `package.json` valid JSON: remove trailing commas.
2. Reconcile dependency manifest with lockfile. Declare required Astro runtime/tooling explicitly (`astro`, `@astrojs/cloudflare`, and intended `wrangler` placement) and regenerate lockfile with npm.
3. Repair malformed Astro/CSS structure in `Packages.astro`, `Hero.astro`, `Features.astro`, and `global.css` before feature work.
4. Run clean install and build. Then run Cloudflare Wrangler dry-run documented in README.

### Priority 1: add quality gates

1. Add an Astro check script (`astro check`) and required checker dependencies if project wants template/type diagnostics in CI.
2. Add formatter rules for Astro/CSS/JSON so missing structure and style drift are caught early.
3. Add CI workflow for install, check, build, and Wrangler dry-run or deploy preview validation.
4. Add smoke/E2E checks for landing render, hash navigation, package card count/data, CTA URLs, and responsive nav behavior.

### Priority 2: improve maintainability and content model

1. Move repeated WhatsApp base number/message helpers into one source to avoid CTA drift between hero, package cards, and footer.
2. Give package and FAQ data explicit types/schema and possibly separate data module/content file if copy grows.
3. Replace starter README with project-specific setup, content-editing notes, deployment flow, and troubleshooting for Cloudflare/Astro.
4. Decide whether `CLAUDE.md` is intended project documentation; track it or remove local-only copy to avoid conflicting guidance.
5. Normalize formatting/indent style after formatter adoption.

### Priority 3: improve product page quality

1. Audit accessibility after syntax repair: keyboard focus, heading order, nav landmarks/labels, contrast, image alt text, reduced-motion behavior, fixed-header hash focus behavior.
2. Add SEO/social metadata in layout: canonical strategy, Open Graph/Twitter tags, favicon fallback link if desired, structured business/product data where accurate.
3. Optimize assets and loading behavior: confirm AVIF dimensions/weight, add explicit image dimensions or responsive image strategy, decide whether hero is eager/high priority.
4. Add measurable conversion/operational path if required: analytics with privacy decision, CTA event tracking, backup contact channel when WhatsApp cannot open.
5. Keep commercial claims and package details accurate; clarify price units/tax/setup fees/coverage constraints if business requires them.

## Implementation strategy

For this task, output should stay analysis-first: preserve application files and provide recommendations rather than inventing product behavior. If follow-up asks for fixes, safest order is:

1. Fix manifest JSON and dependency drift so tools can run predictably.
2. Restore valid Astro/CSS syntax while preserving existing section IDs, Indonesian copy, package/FAQ intent, and Cloudflare adapter config.
3. Run build/check and inspect generated site manually at mobile and desktop breakpoints.
4. Add automated checks/config only after baseline output is known-good, so new failures are actionable.
5. Refactor duplicated WhatsApp/data concerns in small steps with CTA URL regression checks.

Expected files for likely follow-up baseline repair:

- `package.json`
- `package-lock.json`
- `src/components/Hero.astro`
- `src/components/Packages.astro`
- `src/components/Features.astro`
- `src/styles/global.css`

Expected files for likely follow-up quality/documentation work:

- `README.md`
- CI workflow under `.github/workflows/`
- formatter/check config and possibly scripts in `package.json`
- optional data/helper modules under `src/` if repeated CTA/package content is extracted

## Potential risks and considerations

- Build is not trustworthy until manifest and malformed source syntax are fixed; recommendation work based on rendered output should be verified after repair.
- Cloudflare adapter changes can alter SSR/worker output; do not remove adapter or Wrangler settings while fixing unrelated UI code.
- Lockfile/manifest drift may change dependency versions if regenerated carelessly. Prefer npm lockfile update from intended manifest and inspect diff.
- Fixed header depends on hash section IDs and scroll offsets. Renaming/removing IDs can break navigation.
- WhatsApp URLs are conversion-critical. Preserve URL encoding, phone number, external-link safety attributes, and package-specific message behavior during refactor.
- Package prices/speeds and legal/commercial wording are business data; confirm before changing semantics.
- No tests/CI protect responsive CSS. CSS repairs and refactors need visual review across breakpoints and reduced-motion mode.

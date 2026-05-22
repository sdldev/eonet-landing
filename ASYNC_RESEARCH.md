# Async Research: Upgrade Astro to 6.3.7

## Project summary

EONET landing page is an Astro-based Indonesian ISP marketing site deployed with the `@astrojs/cloudflare` adapter to Cloudflare Workers/Pages. The app is a single route (`src/pages/index.astro`) composed from section components, with shared layout metadata and global CSS design tokens.

## Relevant files examined and why

- `README.md` — Documents project commands, Astro route conventions, build/preview flow, and Cloudflare Wrangler dry-run validation after `npm run build`.
- `CLAUDE.md` — Contains project-specific architecture notes, style conventions, deployment notes, and validation guidance. Confirms no test script; build is primary validation.
- `package.json` — Main dependency manifest. Current direct dependencies include `astro` at `^6.2.2`, `@astrojs/cloudflare` at `^13.3.1`, and dev dependency `wrangler` at `^4.87.0`. Scripts are `dev`, `build`, `preview`, and `astro`.
- `package-lock.json` — Lockfile pins installed package metadata. Current `node_modules/astro` entry is version `6.2.2`; root package records `astro: ^6.2.2`. This is primary file needing lock update for Astro 6.3.7.
- `astro.config.mjs` — Uses `defineConfig` from `astro/config` and `cloudflare()` adapter. No custom config likely impacted by patch/minor Astro upgrade.
- `tsconfig.json` — Extends `astro/tsconfigs/strict`; Astro package upgrade can affect this referenced config.
- `wrangler.jsonc` — Cloudflare deployment config. Uses compatibility date `2026-02-08`, `nodejs_compat`, `assets.binding = ASSETS`, observability object. Not directly changed by Astro upgrade but relevant because adapter output and Wrangler dry-run depend on this environment.
- `.vscode/extensions.json` and `.vscode/launch.json` — Astro VS Code recommendation and local dev launch command; no dependency version changes needed.
- `.gitignore` — Ignores `dist/`, `.astro/`, `node_modules/`, logs, env files, local agent artifacts, and test artifacts.
- `src/pages/index.astro` — Entry route composing `Header`, `Hero`, `Packages`, `Features`, `Footer` inside `Layout`.
- `src/layouts/Layout.astro` — Imports `src/styles/global.css`, defines metadata, favicon, generator tag, and body background shell.
- `src/components/Header.astro`, `Hero.astro`, `Packages.astro`, `Features.astro`, `Footer.astro` — Landing-page components. They establish local component style conventions and use root-relative assets/WhatsApp URLs. No Astro APIs beyond component/frontmatter basics appear relevant to dependency upgrade.
- `src/styles/global.css` — Shared CSS variables, utility classes, responsive rules, and motion preferences. No dependency upgrade changes expected.
- `public/` assets (`favicon.svg`, `favicon.ico`, `eonet.avif`, `.assetsignore`) — Static assets referenced by layout/components; no upgrade action expected.

## Patterns and conventions identified

- Project uses ESM (`"type": "module"`) and Astro `.astro` components.
- Routes live under `src/pages/`; `index.astro` is composition-only.
- Shared page shell lives in `src/layouts/Layout.astro`; global CSS imported there.
- Components are section-oriented and colocate CSS in `<style>` blocks.
- Imports in Astro files use relative paths with double quotes in page files; config uses single quotes and semicolons.
- CSS uses design tokens in `:root` (`--space-*`, `--bg-*`, `--text-*`, `--accent-*`, `--radius-*`, `--shadow-*`) plus shared classes (`container`, `section`, `btn`, `surface-panel`, etc.).
- Static assets are referenced root-relative from `public/`, e.g. `/eonet.avif` and `/favicon.svg`.
- Navigation anchors use stable section IDs: `#home`, `#packages`, `#features`, `#contact`.
- WhatsApp CTAs use encoded `https://wa.me/6289624424649?...` links.
- No explicit lint, format, or test config exists. Validation should use `npm run build`; optional Cloudflare bundle validation is `npx wrangler deploy --config dist/server/wrangler.json --dry-run` after build.
- No CI/CD workflow files were found under the searched repository tree.

## Dependency/version findings

- Current direct Astro dependency is `astro: ^6.2.2` in `package.json`.
- Current lockfile `node_modules/astro` version is `6.2.2`.
- `@astrojs/cloudflare@13.3.1` declares peer dependency `astro: ^6.0.0`, so Astro `6.3.7` should satisfy adapter peer range.
- `npm view astro@6.3.7` shows Astro `6.3.7` requires Node `>=22.12.0` and npm `>=9.6.5`.
- Astro `6.3.7` depends on `@astrojs/internal-helpers@0.9.1`, `@astrojs/telemetry@3.3.2`, `vite@^7.3.2`, and other current Astro 6-era packages. Lockfile update may change transitive package entries even if direct code is unchanged.
- `wrangler@4.87.0` in lockfile requires Node `>=22.0.0`; Astro `6.3.7` raises effective local/CI Node requirement to `>=22.12.0`.

## Implementation strategy

1. Update `package.json` Astro dependency from `^6.2.2` to the requested `6.3.7` (exact version preferred because task asks for `astro 6.3.7`).
2. Regenerate `package-lock.json` with npm so root dependency metadata and `node_modules/astro` entry resolve to `6.3.7` and transitive Astro dependencies are consistent.
3. Do not change application source unless build reveals an Astro 6.3.7 compatibility issue.
4. Run `npm run build` as primary validation.
5. If build succeeds and generated Cloudflare bundle exists, optionally run `npx wrangler deploy --config dist/server/wrangler.json --dry-run` if environment supports required Node/runtime and network.

## Potential risks or considerations

- Node version is important. Astro `6.3.7` requires Node `>=22.12.0`; current environment/CI must match or builds may fail before app code runs.
- Lockfile regeneration may update transitive packages beyond `astro` because Astro 6.3.7 dependency ranges differ from 6.2.2.
- Cloudflare adapter `@astrojs/cloudflare@13.3.1` peer range allows Astro 6, but generated Worker output should still be validated with `npm run build` and Wrangler dry-run.
- Existing source files appear to contain some unusual/incomplete-looking syntax when viewed in truncated command output, especially `Packages.astro` object properties and some CSS blocks. If build fails after upgrade, determine whether failure pre-existed before attributing it to Astro 6.3.7.
- No tests or lint scripts exist, so build output is the main safety net.
- `node_modules/` is ignored and not present/usable in current repository state; dependency validation requires `npm install` or `npm ci` before build.

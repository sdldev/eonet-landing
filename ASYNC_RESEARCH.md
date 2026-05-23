# Async Research

## Project summary
EONET landing page is Astro 6 site for Indonesian internet service packages, built as SSR/static-style landing page and deployed to Cloudflare Workers through `@astrojs/cloudflare`. Main app is one route (`src/pages/index.astro`) composed from Astro layout and section components, with global CSS tokens plus scoped component styles.

## Relevant files examined and why
- `README.md`: Default Astro README with project structure and commands. Documents `npm install`, `npm run dev`, `npm run build`, `npm run preview`, and Wrangler dry-run validation after build.
- `CLAUDE.md`: Project-specific guide. Confirms stack, directory roles, Cloudflare deployment flow, no test script, `npm run build` as primary validation, and warns `package.json` has trailing commas that can break npm parsing.
- `package.json`: Root dependency manifest. Contains scripts for Astro dev/build/preview, `type: module`, and dependency on `@astrojs/cloudflare`. File currently has invalid trailing commas after script/dependency entries and empty devDependencies; this blocks npm commands until fixed. It also does not list `astro` or `wrangler`, though lockfile root package does.
- `package-lock.json`: Lockfile for dependency tree. Root package section includes `@astrojs/cloudflare: ^13.3.1`, `astro: ^6.2.2`, and devDependency `wrangler: ^4.87.0`. `node_modules/astro` is locked to `6.2.2` and depends on `devalue: ^5.6.3`; `node_modules/devalue` is locked to vulnerable `5.8.0`. This is central task target.
- `astro.config.mjs`: Astro config imports `@astrojs/cloudflare` and calls `defineConfig({ adapter: cloudflare() })`. Any Astro version change must keep adapter compatibility.
- `tsconfig.json`: Extends `astro/tsconfigs/strict`, includes all project files, excludes `dist`.
- `wrangler.jsonc`: Cloudflare Worker metadata: name `eonet`, compatibility date `2026-02-08`, `nodejs_compat`, assets binding `ASSETS`, observability placeholder. Generated build output also creates `dist/server/wrangler.json`.
- `.gitignore`: Ignores `dist`, `.astro`, `node_modules`, logs, env files, IDE files, local agent artifacts, and `test-results`.
- `.vscode/extensions.json` and `.vscode/launch.json`: Recommends Astro extension; launch config runs local Astro dev binary.
- `src/pages/index.astro`: Single page route. Imports `Layout`, `Header`, `Hero`, `Packages`, `Features`, `Footer` and composes landing page.
- `src/layouts/Layout.astro`: HTML shell, imports global CSS, sets metadata, favicon, `Astro.generator`, fixed background.
- `src/components/Header.astro`, `Hero.astro`, `Packages.astro`, `Features.astro`, `Footer.astro`: UI sections with Indonesian copy and scoped styles. They do not import or deserialize `devalue` directly.
- `src/styles/global.css`: Global design tokens, reset/base styles, shared classes (`.container`, `.btn`, `.section`, `.surface-panel`) and responsive rules. No dependency relevance beyond build validation.

## Architecture map
- `src/pages/`: File-based Astro routes. Current site has only `index.astro`.
- `src/layouts/`: Shared page shell (`Layout.astro`) with props interface, metadata, global styles.
- `src/components/`: Landing sections as standalone Astro components. Naming is PascalCase (`Header.astro`, `Hero.astro`, etc.). Components use frontmatter then markup then scoped `<style>` block.
- `src/styles/`: Shared CSS, variables, utility classes, media queries.
- `public/`: Static assets referenced from absolute URLs like `/eonet.avif` and `/favicon.svg`.
- Root config: `astro.config.mjs`, `tsconfig.json`, `wrangler.jsonc`, `package.json`, `package-lock.json`.

## Patterns and conventions identified
- ESM project (`"type": "module"`); config uses `import` syntax and `.mjs`.
- Astro imports use relative paths with double quotes in page (`../layouts/Layout.astro`) and single quotes in config.
- Astro component style: frontmatter delimiter, semantic HTML, CSS scoped inside same file, CSS variables from global design system.
- Landing copy is Indonesian and uses EONET branding. WhatsApp CTA URLs use `target="_blank"` and `rel="noreferrer"`.
- Build validation pattern: no test script; use `npm run build`. Wrangler dry-run can validate generated Cloudflare Worker after build.
- Package manager is npm with lockfileVersion 3. Dependency updates should be done through npm lockfile changes, not hand-only source edits if possible.
- Cloudflare adapter `@astrojs/cloudflare@13.3.1` peer-depends on `astro: ^6.0.0` and `wrangler: ^4.83.0`, so Astro 6.3.x remains compatible.

## Dependency findings
- `npm view astro version` currently returns `6.3.7`.
- `npm view devalue version` currently returns `5.8.1`, which is `>5.8.0`.
- Astro versions `6.3.0` through `6.3.7` still declare `devalue: ^5.6.3`; because semver range allows `5.8.1`, refreshing lockfile can resolve devalue above vulnerable `5.8.0` without needing a changed Astro dependency range.
- `package-lock.json` currently pins `node_modules/devalue` to `5.8.0`; updating lockfile should move it to `5.8.1` with integrity `sha512-4CXDYRBGqN+57wVJkuXBYmpAVUSg3L6JAQa/DFqm238G73E1wuyc/JhGQJzN7vUf/CMphYau2zXbfWzDR5aTEw==`.
- Root `package.json` and lockfile are inconsistent: lockfile root includes `astro` and `wrangler`, but `package.json` does not. `package.json` is invalid JSON because of trailing commas, so npm cannot update/install until this is corrected.

## Implementation strategy
1. Fix `package.json` JSON syntax by removing trailing commas.
2. Align manifest with existing lockfile/root scripts by adding explicit dependencies/devDependencies if needed: keep `@astrojs/cloudflare`, add `astro` in dependencies, and add `wrangler` in devDependencies to match lockfile and scripts/deployment notes.
3. Update Astro to latest compatible 6.x (currently `^6.3.7`) and refresh `package-lock.json` with npm so `node_modules/astro` and dependency tree are coherent.
4. Ensure resolved `devalue` is `5.8.1` or newer (`>5.8.0`) in `package-lock.json`.
5. Run `npm install` or targeted npm update after syntax fix, then run `npm run build` as primary validation. Run `npm audit` if available to verify GHSA is cleared.
6. Avoid touching app UI/components unless build exposes unrelated syntax issues.

## Potential risks or considerations
- `package.json` invalid trailing commas currently block npm commands; fixing them changes manifest but is necessary to update dependency lock safely.
- Astro 6.3.x requires Node `>=22.12.0` per lockfile engine metadata; build environment must satisfy this.
- `@astrojs/cloudflare@13.3.1` peers with `astro ^6.0.0`; latest Astro 6.3.7 should satisfy it, but generated Worker output may shift slightly.
- Lockfile may update more transitive packages than only `devalue` if npm performs full resolution. Prefer minimal update command where possible, but accept lockfile coherence.
- No direct server-side code deserializes attacker-controlled devalue payloads in app source; vulnerability comes from framework/runtime bundle dependency.
- No CI config found in repository; validation relies on local `npm run build` and optional Wrangler dry-run.

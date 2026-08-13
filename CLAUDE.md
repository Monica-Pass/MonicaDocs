# Claude Collaboration Guide

## Project Scope

This is the source of Monica's standalone VitePress website. It covers product introduction, guides, reference documentation, and ecosystem pages.

## Common Commands

Run from the `MonicaDocs` directory:

```bash
npm run docs:dev
npm run docs:build
```

- `npm run docs:dev` runs the docs site at `http://127.0.0.1:5173/`.
- `npm run docs:build` builds the docs site, outputting to `.vitepress/dist`.

## Content & Routing

- Simplified Chinese content: `01.指南`, `02.配置`, `03.生态`.
- Multilingual content: `en`, `ja`, `ru`, `vi`.
- Homepage: `index.md` at the repo root and `index.md` under each language directory.
- Ecosystem page: `03.生态/目录.md` and `.vitepress/theme/components/EcosystemLanding.vue`.
- Page edit links and top navigation: `.vitepress/locales/*.mjs`.

## Modification Principles

- When changing user-facing features, routes, or navigation, check whether all language versions need to be synced.
- Prefer reusing VitePress, Teek, and existing theme components; do not introduce new front-end frameworks.
- The ecosystem page uses a clean documentation style: avoid large gradients, decorative animations, and excessive border radius; use `8px` for panel corners.
- Documentation links use site-absolute paths, e.g. `/reference/catalogue.html`; the admin page always uses `/login`.
- `.vitepress/dist` and `.vitepress/cache` are generated directories — do not edit them manually.

## Verification

- After changing docs or the theme, at least confirm the dev page loads correctly.
- Run `npm run docs:build` before merging.

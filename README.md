# Le Truc Components

A component library and living style guide built on top of [Le Truc](https://github.com/zeixcom/le-truc), Zeix's reactive Custom Elements framework. It provides a set of example and production-quality Web Components — from simple building blocks to composite modules — documented and demoed in Storybook.

## What's in here

Components live in `src/`, grouped by category:

| Category | Purpose | Examples |
|---|---|---|
| `basic/` | Minimal single-purpose elements, mostly used to teach Le Truc concepts | `basic-button`, `basic-counter`, `basic-gauge` |
| `card/` | Self-contained content cards | `card-blogpost`, `card-collapsible`, `card-colorscale` |
| `context/` | Context providers shared across a subtree | `context-media` |
| `form/` | Form-associated custom elements | `form-checkbox`, `form-combobox`, `form-listbox` |
| `module/` | Larger composite/interactive modules | `module-carousel`, `module-dialog`, `module-todo` |

Each component directory typically contains:
- `<name>.ts` — the component definition (`defineComponent(...)`)
- `<name>.css` — component styles (host-scoped)
- `<name>.stories.ts` — Storybook stories, including play-function tests
- `<name>.mdx` — documentation page for Storybook

`src/main.ts` imports every component so they're registered when the app loads. `src/_common/` holds shared helpers used across components (formatting, color conversion, caching, etc.).

## Getting started

Install dependencies (this project uses both `bun.lock` and `package-lock.json` — either `bun install` or `npm install` works):

```bash
npm install
```

Common scripts:

```bash
npm run dev              # start Vite dev server
npm run storybook        # analyze custom elements + start Storybook on :6006
npm run build             # type-check and build with Vite
npm run build-storybook   # analyze custom elements + build static Storybook
npm run lint              # tsc --noEmit + biome check
npm run analyze            # regenerate custom-elements.json
```

Tests run through Storybook's Vitest integration (story play-functions, browser-based via Playwright/Chromium):

```bash
npx vitest run
```

## Tech stack

- [Le Truc](https://github.com/zeixcom/le-truc) (`@zeix/le-truc`) — reactive Custom Elements
- [Custom Elements Manifest](https://github.com/open-wc/custom-elements-manifest) analyzer + `@zeix/cem-plugin-le-truc` — generates `custom-elements.json`, consumed by Storybook's docs addon
- [Storybook](https://storybook.dev) — component explorer, docs, and test runner
- [Vite](https://vite.dev) + TypeScript — dev server and build
- [Biome](https://biomejs.dev) — formatting and linting
- [Vitest](https://vitest.dev) + Playwright — browser-based story tests

## Documentation

- Storybook itself (`npm run storybook`) is the primary reference: every component has a docs page and live, interactive examples.
- `.agents/skills/le-truc/` contains detailed guidance on the Le Truc component model, conventions, and anti-patterns — useful background reading even for humans, and the source of truth for AI coding agents (see `AGENTS.md`). Skills are kept under the agent-agnostic `.agents/` path; `.claude/skills` is just a symlink to it for Claude Code users.

## License

[MIT](LICENSE), same as [`@zeix/le-truc`](https://github.com/zeixcom/le-truc).

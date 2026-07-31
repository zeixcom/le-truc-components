# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this repo is

A component library / style guide built on **Le Truc** (`@zeix/le-truc`), a reactive Custom Elements framework. Components are grouped under `src/` by category (`basic/`, `card/`, `context/`, `form/`, `module/`), each with a `.ts` definition, `.css`, Storybook `.stories.ts`, and an `.mdx` doc page. See `README.md` for the full layout.

## Start here: the `le-truc` skill

Before creating, reviewing, or debugging any component, load `.agents/skills/le-truc/SKILL.md`. It is the authoritative guide for this codebase's component model: the factory form of `defineComponent`, reactivity flow, DOM binding helpers, inter-component coordination (`pass`, contexts, `each`), domain vocabulary, and anti-patterns. It routes to `workflows/build.md`, `workflows/review.md`, or `workflows/debug.md` depending on the task, and to detailed references under `.agents/skills/le-truc/references/`.

Skills live under the agent-agnostic `.agents/skills/` path. `.claude/skills` is a symlink to `.agents/skills` so Claude Code discovers the same skill without duplicating it — if your agent looks for skills elsewhere, point it at `.agents/skills/le-truc/SKILL.md` directly.

The skill references root-level `ARCHITECTURE.md`, `REQUIREMENTS.md`, and `CONTEXT.md` as authoritative sources — these files do not currently exist in this repo. Treat the skill's own documentation and the `src/` source code as authoritative until/unless those files are added.

## Commands

```bash
npm install               # install deps (bun.lock and package-lock.json both present; either package manager works)
npm run dev               # Vite dev server
npm run analyze           # regenerate custom-elements.json (CEM analyzer)
npm run storybook         # analyze + Storybook dev server on :6006
npm run build-storybook   # analyze + static Storybook build
npm run build             # tsc + vite build
npm run lint              # tsc --noEmit + biome check .
npx vitest run            # run story play-function tests (Playwright/Chromium, headless)
```

Always run `npm run lint` and `npx vitest run` before considering a component change complete. Run `npm run analyze` after adding/changing a component's public API (props, slots, events) so `custom-elements.json` and Storybook docs stay in sync.

## Conventions specific to this repo

- **One component per directory**, named `<category>-<name>` (e.g. `form-listbox`, `module-carousel`), matching the custom element tag name.
- **Factory form only** for `defineComponent` — no class-based components. See the skill's `component-model.md`.
- **`host` is the only external interface** to a component: read/write state via `host.propName`, never query into a child component's internals or reach across siblings. Sibling-to-sibling coordination is not supported — lift shared state to a common ancestor (context or parent).
- Stories double as tests: play functions in `.stories.ts` are executed by Vitest via Storybook's addon. New interactive behavior needs a story with a play function, not a separate test file.
- Some stories are legitimately environment-limited (e.g. depend on full ICU locale data unavailable in the headless test browser) and are tagged `tags: ["skip"]` in the story to opt out of the Vitest run while staying live in Storybook — don't "fix" these by deleting coverage; check `vitest.config.ts` for the mechanism.
- Formatting/linting is Biome (`biome.jsonc`), not ESLint/Prettier — run `npm run lint`, don't reach for other tools.
- `custom-elements.json` is generated (`npm run analyze`) via `@custom-elements-manifest/analyzer` + `@zeix/cem-plugin-le-truc` (see `custom-elements-manifest.config.mjs`) — don't hand-edit it.

## Before finishing a task

1. `npm run lint` — must be clean.
2. `npx vitest run` — no new failures or regressions.
3. If a component's public API changed, `npm run analyze` to refresh `custom-elements.json`.
4. Prefer verifying interactive behavior in Storybook (`npm run storybook`) over asserting it works from reading the code.

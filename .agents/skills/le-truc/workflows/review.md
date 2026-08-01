# Review Workflow

**Use when:** Reviewing or extending an existing Le Truc component.

**Required reading first:**
- `references/anti-patterns.md` — what to flag and fix
- `references/accessibility.md` — ARIA correctness for the widget type
- `references/coordination.md` — verify correct inter-component mechanism
- `references/storybook.md` — if `.stories.ts`/`.html.ts` are part of the review

Read `references/effects.md` or `references/parsers.md` if specific choices seem wrong.

---

## Step 1: Read the Component

Read **all files** for the component being reviewed:
- `.ts` — component definition
- `.html.ts` — Storybook render function and example states
- `.css` — styles
- `.stories.ts` — CSF: controls, stories, `play()` tests
- `.mdx` — narrative documentation (if present)

**Do not propose changes to code you have not read.**

---

## Step 2: Check TypeScript

Work through `references/anti-patterns.md` and flag any violations. Also verify:

- **Props type:** every reactive property explicitly typed; no implicit `any`
- **Initializers:** attribute-driven props use correct parsers (`asString`, `asBoolean`, `asInteger`, `asNumber`, `asEnum`, `asJSON`); DOM-derived initial values read directly before `expose()`; custom parsers wrapped with `asParser()`; method props wrapped with `defineMethod()`
- **`expose()` called once:** all props declared in single `expose()` call before any effects
- **Effect registration:** every `watch()`, `on()`, `pass()`, `each()`, `provideContexts()` call registers itself — no `return` needed (a `return [...]` of the same descriptors still works but is deprecated); optional elements use `if (el) watch(...)` guard (`on(el, ...)` and `pass(el, ...)` handle falsy targets internally — no guard required)
- **Statement layout:** each `first()`/`all()` sits directly above the effect(s) that consume it, grouped by concern, not hoisted in one block — except queries that seed `expose()` or feed several concerns, which stay hoisted near the top (see `references/effects.md`)
- **`on()` handlers:** return `{ prop: value }` when updating host props; return `void` for side-effects only
- **Custom `watch` handlers:** return cleanup function if they set up listeners or timers
- **Reactivity:** DOM values read inside reactive thunks stay current — prefer live DOM APIs (`element.children`, `getElementsByTagName`) over snapshot APIs (`querySelectorAll`, `Array.from`); or use `createElementsMemo` for signal-backed collection
- **Coordination:** `pass()` used only for Le Truc-to-Le Truc bindings; `watch()` + `bindProperty()` for all others

---

## Step 3: Check the Storybook Render Function and Stories

Follow `references/storybook.md`. Verify:

- Native semantic elements used inside custom element; markup valid and functional without JavaScript (progressive enhancement)
- All meaningful states and variant combinations represented as controls/stories, not hardcoded duplicates
- No inline styles or inline event handlers
- `.html.ts` has no Storybook imports and no `component.ts`/`.css` side-effect imports
- `.stories.ts` exports only `default` and `StoryObj`s — any reusable render function or `argTypes` lives in `.html.ts`, not behind `excludeStories`
- Per-story `render:` overrides are used only for genuine DOM-structure differences (flagged `// ⚠️ Custom render: <reason>`), not as a substitute for `args`
- If a prop can be set via attribute after connect by an external tool (Storybook Controls, a React wrapper) and the component's own JS doesn't observe that: is `observedAttributes([...])` needed, or intentionally absent?
- If a story renders an arg as element child *text* that the component also writes via `bindText`/`textContent`: does the component use `bindText(el, true)` / `setTextPreservingComments`, avoiding the Lit `ChildPart` crash?

---

## Step 4: Check CSS

- All rules scoped to host element tag name
- CSS nesting used for descendant selectors
- Design-token custom properties used for all colors, spacing, typography
- Variant styles expressed as modifier classes on host, not separate selectors

---

## Step 5: Check Accessibility

Follow `references/accessibility.md` for widget type. Verify:

- Correct ARIA role on appropriate element (or native element used)
- Interactive ARIA states (`aria-expanded`, `aria-selected`, etc.) kept in sync via `watch()` + `bindAttribute(el, name)`
- Focus management correct for pattern (dialogs, menus, tabs)
- Labels present and associated

---

## Step 6: Check Documentation

If `.mdx` file present, verify it covers sections required by `references/documentation.md` for component's feature set (properties, attributes, CSS classes, descendants, methods, events as applicable). Prefer `<Controls>` over a hand-written Reactive Properties table when every prop it would list is already a story control. Types and defaults must match TypeScript source.

---

## Step 7: Report

Summarize findings in three categories:

- **Must fix:** correctness issues, anti-patterns, broken reactivity, broken accessibility
- **Should fix:** missing documentation, suboptimal coordination patterns
- **Optional:** only if explicitly asked — do not suggest splitting watch handlers into bind helpers, adding guards to `on`/`pass` calls, or other style preferences

---

## Success Criteria

- No violations from `references/anti-patterns.md`
- ARIA and semantics correct for widget type
- Correct coordination mechanism in use
- No broken reactivity (snapshot DOM APIs used where live collections/signals needed)
- Documentation complete and accurate

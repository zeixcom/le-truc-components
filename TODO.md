# TODO

## Highest priority

_None open._

---

## Follow-ups

### Rewrite `module-todo` to match upstream's current implementation

Upstream's `module-todo.ts` has since been rewritten to use inline
`createList`/`createStore`/`reconcile()`-based drag-and-drop reordering and
inline editing (via a new `form-inplace-edit` component), replacing the
current add/complete/filter/clear-completed-only port. Our port intentionally
kept the simpler existing feature set because `form-inplace-edit` doesn't
exist in this repo yet.

**Do this only after** the missing upstream example components (starting with
`form-inplace-edit`, and any other newly-added examples this repo hasn't
ported yet) have been added in a separate session. Then do a full rewrite of
`module-todo.ts`/`.stories.ts`/`.mdx`/`.css` to match upstream's current
drag-and-drop + inline-edit implementation, rather than patching the current
simpler version incrementally.

### Confirm/fix `each()`'s callback return type rejecting `void` (possible upstream bug)

Reported error in `module-todo.ts`'s `each(checkboxComponents, checkbox => {...})`
call (no explicit `return`, just calls `pass()` directly per the documented
"call watch()/on()/pass() directly instead of returning them" pattern):

> Argument of type '(checkbox: FormAssociatedElement & FormCheckboxProps) => void' is not assignable to parameter of type '(element: ...) => EffectDescriptor | FactoryResult | Falsy'. Type 'void' is not assignable to type 'EffectDescriptor | FactoryResult | Falsy'.

Investigated: running `npx tsc --noEmit` against this exact code (TypeScript
7.0.2, this project's `tsconfig.json`) does **not** reproduce the error — the
callback's inferred return type comes out as `undefined` (from the bare
`return;` early-exit plus the implicit fall-through at the end), and
`undefined` is a member of `Falsy`, so it type-checks. Upstream's own
`module-todo.ts` has the identical pattern (`each(checkboxComponents, checkbox => { ...; if (...) return; pass(checkbox, {...}) })`)
with no explicit return, so they rely on the same inference.

This doesn't rule out a real bug: whether a mixed-return arrow function like
this infers `undefined` vs `void` is a version/settings-sensitive TypeScript
behavior, and the error is plausible under a different TS version (e.g. the
editor's language server, if it resolves to a different TypeScript than the
project's local `7.0.2`). Action items:
1. Confirm which TypeScript version/config actually produces the error
   (check editor's resolved TS version vs. `npx tsc --version`; try
   reproducing with older TS majors).
2. If reproducible on a supported TS version, file upstream: `each()`'s (and
   any sibling helper's) callback parameter type should include `void`
   explicitly in the union — `(element: E) => FactoryResult | EffectDescriptor | Falsy | void` —
   since the documented idiomatic usage (call `pass()`/`watch()`/`on()`
   directly, no return) naturally produces a void-like callback and shouldn't
   depend on a return-type-inference nuance to type-check.

---

## Done

### Fixed: the 8 failing story/play-function tests

`npx vitest run` is now **98 passed | 1 skipped (99), 0 failed**, down from
8 failed / 91 passed. None of the 8 was a Le Truc library bug — verified
against the library source/design docs and by runtime-probing the ambiguous
ones. They were consumer-side (test/play-function corrections, one component
fix, two environment cases). All 8 were pre-existing: their component logic
and assertions are byte-identical at the pre-2.3 commit.

**A. Play function queried the wrong label/value (test-only):**
- `form-textbox` With Clear — added `userEvent.tab()` before asserting
  `el.value`; `value` commits on `change` (native parity), `input` only
  updates `length`.
- `form-spinbutton` Increment Decrement — query "Add to Cart" for the first
  click (value 0 re-labels the increment button), then "Increment"/"Decrement"
  once value > 0.
- `module-catalog` Default — query "Add to Cart" instead of "Increment"
  (same spinbutton-at-zero re-labeling).

**B. Stale exposed `createElementsMemo` (component fix):**
- `form-listbox` With Filter and With Src — the exposed `options` memo was
  installed by `expose()` as a plain getter with no reactive sink, so its lazy
  `MutationObserver` never activated (ADR 0006) and stayed stale. Extracted
  the memo to a const and added a `watch(visibleOptions, () => {})` so the
  observer starts and `options` is genuinely live. This is documented
  intentional library behavior, not a library bug. (`form-listbox.ts`.)

**C. Test premise invalid under the test environment:**
- `module-lazyload` Invalid URL — `"not-a-valid-url"` is a valid *relative*
  URL and the Vite dev server answers unknown same-origin paths with a 200
  SPA fallback, so `createTask` resolved `ok` and `.error` never showed.
  Switched `src` to a cross-origin URL (`http://localhost:9/nonexistent`),
  which `isValidURL` rejects → the `err` branch fires deterministically.
  Not a `createTask`/`watch` bug. (`module-lazyload.stories.ts`.)
- `basic-number` Locale Inheritance — `Intl.NumberFormat("de-DE", …)` falls
  back to `en-US` because the headless Chromium bundled with
  `@vitest/browser-playwright` ships partial ICU data. Component logic and the
  expected string (`1.234,50\u00a0€`) are verified correct. Added `tags:
  ["skip"]` to the story and wired `tags: { skip: ["skip"] }` into the
  `storybookTest()` plugin in `vitest.config.ts`, so the story is **skipped in
  the Vitest run only** but stays live (and playable) in Storybook. In a
  full-ICU browser it passes. (`basic-number.stories.ts`, `vitest.config.ts`.)

**D. Test misunderstood the component contract (story rewrite):**
- `module-list` Remove Item — `reconcile()` correctly discards pre-rendered
  `<li data-key>` whose keys aren't in the (empty) reactive `list`. Rewrote
  the story to seed two items via the form API (type + Add twice), mirroring
  the passing `AddItem` story, then remove one. (`module-list.stories.ts`.)

Verified: `npx vitest run` → 98 passed | 1 skipped, 0 failed; `tsc --noEmit`
clean; no regressions.

### Fixed: `pass()` failing when parent and nested Le Truc child mount together

`pass()` could throw `InvalidPassPropertyError` when a parent and its Le Truc
child were mounted together from a **detached subtree** — exactly what
framework-driven rendering does (lit-html/Storybook `render()`, or any code
that builds the tree off-DOM then appends it). Upstream's own static-HTML
Playwright pages never hit it because the markup lives in the document before
script runs.

**Root cause (verified via standalone Playwright repros):** `pass()` returns an
auto-registered `EffectDescriptor`; the throwing `swapSlots` runs later inside
`resolveDependencies(runSetup)`. When a whole nested parent+child subtree is
connected in one operation, the browser queues each element's
`connectedCallback` in tree order — the **parent's fires first**. The child is
already `:defined` (class registered), so `first()`/`all()` did *not* add it
to the dependency set, `resolveDependencies` took the **synchronous** callback
path, and `swapSlots` read `'prop' in child` while it was still `false` (the
child's own `connectedCallback` → `expose()`/Slot setup hadn't run yet).
Reproduced deterministically: detached-build-then-append (createElement,
explicit `upgrade()`, detached innerHTML, DocumentFragment) all threw; direct
`innerHTML` into the live document (upstream's path) did not.

**Fix (upstream, shipped in `@zeix/le-truc` 2.3.1):** `makeElementQueries` now
tracks whether `first()`/`all()` matched any `:defined` custom-element
descendant, and if so defers setup by one microtask so the child's queued
`connectedCallback` drains first. Behavior-preserving for the existing
registry-not-defined case; the only observable change is a one-microtask
deferral when a `:defined` custom-element child is present.

- Upstream: `src/helpers/dom.ts` fix + regression tests in `src/tests/dom.test.ts`,
  PR https://github.com/zeixcom/le-truc/pull/87, released as 2.3.1.
- Consumer: bumped `@zeix/le-truc` `^2.3.0` → `^2.3.1`.
- Verified: `npx vitest run` shows `InvalidPassPropertyError` **0 times**;
  8 failed / 91 passed (unchanged from baseline — the bug was latent here and
  is now closed at the root with zero regressions).

Note: this TODO's earlier draft claimed "12 of 99 tests fail with
`InvalidPassPropertyError`." That did **not** reproduce on this branch (0
occurrences). The 5 then-named files (`form-combobox`, `module-catalog`,
`module-listnav`, `module-list`, `module-todo`) pass their `pass()` calls; the
8 tests that actually fail are unrelated and tracked in the top-priority item
above.

### Fixed: Storybook Controls crash from Le Truc overwriting Lit's ChildPart markers

`bindText(el)` (default, non-preserving) clears *all* child nodes before
writing text — including the comment-node markers Lit uses to track a
`${expression}` ChildPart. Any component whose Storybook story interpolates
dynamic content into the same element the component also `bindText()`s (e.g.
`<span class="label">${label}</span>` in the story, `bindText(label)` in the
component) destroys those markers on first connect; the next time Storybook
Controls re-invoke the story's `render()` with new args, Lit tries to update
a ChildPart whose markers are gone and throws.

Fixed by switching those call sites to `bindText(el, true)`
(`preserveComments: true`), which behaves identically when no comments are
present, so it's safe everywhere it was applied. Confirmed via
`npx tsc --noEmit`/`npx vitest run` — no regressions (same pass count as
before this change; unrelated to the `pass()` issue).

Fixed in: `src/basic/button/basic-button.ts` (`label`, `badge`),
`src/basic/hello/basic-hello.ts` (`output`),
`src/basic/counter/basic-counter.ts` (`count`),
`src/form/checkbox/form-checkbox.ts` (`label`),
`src/form/combobox/form-combobox.ts` (`descriptionEl`),
`src/form/textbox/form-textbox.ts` (`descriptionEl`),
`src/module/pagination/module-pagination.ts` (`valueEl`, `maxEl`).

Not affected (verified no lit-html `${}` expression targets that element in
the story): `.error` elements in combobox/textbox, `card-mediaqueries`'s
`.motion`/`.theme`/`.viewport`/`.orientation`, `basic-pluralize`'s `.count`
span, `basic-number`'s host element. Left as plain `bindText(el)`.

Upstream's own examples never need this (their vanilla HTML/JS demo pages
don't re-render via a framework), so this is scoped to this project's
Storybook wrapper only — not an upstream fix.

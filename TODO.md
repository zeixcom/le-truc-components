# TODO

## Highest priority

### Investigate `pass()` failing when parent and nested Le Truc child mount together (Storybook/Vitest)

12 of 99 story-based tests fail with `InvalidPassPropertyError` in exactly these
files: `form/combobox`, `module/catalog`, `module/listnav`, `module/list`,
`module/todo`. All five call `pass(childEl, {...})` on a Le Truc child obtained
via `first()`/`all()`, where the child is a **direct descendant in the same
markup** the parent itself is rendered with (e.g. `<module-catalog><basic-button>...`).

Root cause (confirmed): `pass()` runs synchronously during the parent's own
`connectedCallback`. When both the parent's and child's custom element classes
are already registered (true once everything is bundled — Storybook/Vitest
import every component module up front), inserting the whole nested subtree in
one operation queues upgrade reactions in tree order and processes them
synchronously, parent first. So the parent's `pass()` call runs and reads the
child's exposed properties *before* the child's own `connectedCallback` (and
its `expose()`) has run — `'prop' in child` is still `false`.

`FactoryContext`'s `resolveDependencies` mechanism (in `first()`/`all()`) only
defers setup via `queueMicrotask` when a queried tag *isn't yet registered*
(`isNotYetDefinedComponent`) at query time. It does not detect "class
registered, but this specific instance hasn't upgraded yet," so it never
kicks in here.

Confirmed this is not a porting mistake: the component `.ts` logic matches
upstream 1:1, and upstream's own Playwright tests for the identical
compositions (`test/pass/test-pass.spec.ts`, `module/catalog`, etc.) pass
because they navigate to a real static HTML page where the markup exists
*before* any script runs — a different precondition than Storybook's
programmatic `render()`.

Tried and ruled out: `customElements.upgrade(host)` at the top of the
parent's factory — confirmed via testing that it does **not** help, because
the child element is already the correct (upgraded) class; what's missing is
that its queued `connectedCallback` reaction (which runs `expose()`) simply
hasn't fired yet. There's no public API to force a queued reaction to run
early.

**Needs investigation, roughly in this order:**
1. Check whether Le Truc itself could detect "instance not yet connected" (not
   just "class not yet defined") in `first()`/`all()` and add it to
   `resolveDependencies`'s microtask-deferred set — this would fix it at the
   root, for every consumer, not just Storybook.
2. If that isn't feasible upstream, evaluate a Storybook-side workaround (e.g.
   a decorator that defers `play()`/assertions past the reaction queue drain —
   though note the exception currently throws during initial *render*, before
   `play()` even starts, so this may require deferring the render/mount step
   itself, not just `play()`).
3. **Worst case fallback**, as discussed: replace the affected `pass()` calls
   with `watch(reactive, value => { child.prop = value })`. This works
   because `watch()`'s effect still runs synchronously too, but writing a
   plain property assignment doesn't require the child to have upgraded its
   `Slot`-backed accessor yet — the write becomes an ordinary instance
   property that the child's `expose()` will pick up as its *initial* value
   once its own `connectedCallback` finally runs (same mechanism that makes
   attribute/property pre-sets work before upgrade). Understand: this loses
   `pass()`'s "replace the child's `Slot` signal directly" optimization (zero
   intermediate effect / signal restoration on parent disconnect) — every
   subsequent parent-side signal update would go through a manual effect
   instead of the child's own reactivity swap. Only fall back to this if (1)
   and (2) are dead ends.

Affected files once a fix direction is chosen: `src/form/combobox/form-combobox.ts`,
`src/module/catalog/module-catalog.ts`, `src/module/listnav/module-listnav.ts`,
`src/module/list/module-list.ts`, `src/module/todo/module-todo.ts`, and their
`.stories.ts` play functions.

---

## Follow-ups

### Analyze and fix the 12 failing story/play-function tests

Once the `pass()` timing issue above is resolved, re-run `npx vitest run` and
confirm all 5 affected story files (`form-combobox`, `module-catalog`,
`module-listnav`, `module-list`, `module-todo`) pass their play functions
without the `InvalidPassPropertyError` workaround. Re-verify assertions still
match intended behavior (some may have been written/left assuming the
current failure).

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
`npx tsc --noEmit`/`npx vitest run` — no regressions (same 87/99 pass count
as before, unrelated to the `pass()` issue above).

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

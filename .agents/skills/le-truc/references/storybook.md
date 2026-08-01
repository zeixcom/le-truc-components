# Storybook

**Overview:** How this project documents and exercises Le Truc components in Storybook, and how to avoid the interop pitfalls that show up when a Lit-rendered story wraps a Le Truc component. This reference describes the actual, current file layout — it supersedes any mention of standalone `.html`/`.md` example files elsewhere in this skill.

---

## File Layout

Each component directory holds up to five files:

| File | Contents |
|---|---|
| `component.ts` | The component definition (`defineComponent`) |
| `component.css` | Scoped styles |
| `component.html.ts` | Storybook-agnostic Lit `html` render function(s) + `Args` type — **no Storybook imports** |
| `component.stories.ts` | Pure CSF: `Meta`, `argTypes`, `StoryObj` exports, `play()` tests — imports its render function from `component.html.ts` |
| `component.mdx` | Narrative docs: description, `<Canvas>`, `<Controls>`, descendant/reactive-property tables |

`component.html.ts` and `component.stories.ts` are separate files for one reason: **Storybook's CSF/vitest addon treats every named export from a `*.stories.ts` file (besides `default`) as a story candidate.** A file that exports a reusable render function or a shared `argTypes` object alongside its actual stories gets those extra exports auto-registered and executed as if they were stories — this has caused real failures (calling a helper function with zero args as a "story" throws). The old fix was `meta.excludeStories: /regex/`; keeping non-story exports in a separate `.html.ts` file removes the need for that workaround entirely — `*.stories.ts` only ever exports `default` and `StoryObj`s.

---

## `component.html.ts` — the render function

```typescript
import { html } from 'lit'

export type MyComponentArgs = {
  label: string
  disabled: boolean
}

// Exported so other components' *.html.ts files can embed an instance via
// ${MyComponent(args)} instead of duplicating its markup.
export const MyComponent = ({ label, disabled }: MyComponentArgs) => html`
  <my-component ?disabled=${disabled}>
    <button type="button" ?disabled=${disabled}>${label}</button>
  </my-component>
`
```

- Export the render function under the **PascalCase form of the full tag name** — the same name the Custom Elements Manifest (CEM) plugin reports for the component (`card-blogmeta` → `CardBlogmeta`, `card-colorscale` → `CardColorscale`, `form-checkbox` → `FormCheckbox`), not a short concept name and not the raw tag name. This used to be a bare concept name (`Blogmeta`, `Colorscale`, `Checkbox`) — that convention is retired because short names collide with reserved words (`basic-number`'s render function can't be called `Number`) and with each other across unrelated components (`module-list`'s `List` vs. le-truc's own exported `List` type). The full tag-derived name is always unique and never collides with a JS/TS built-in.
- Export the `Args` type alongside it — consumers need it for composition.
- No `import type { Meta }` unless the file also exports a reusable `argTypes` object (see below) — otherwise keep this file free of Storybook packages.
- Only register custom-element/CSS **side effects** (`import "./component.ts"`, `import "./component.css"`) in `component.stories.ts`, never in `.html.ts` — registration is a story/test concern, not a template concern.

### Composing components

When one component's story embeds another's, import the render function from its `.html.ts`, not its `.stories.ts`:

```typescript
// card-blogpost.html.ts
import { CardBlogmeta, type CardBlogmetaArgs } from '../blogmeta/card-blogmeta.html'

export const CardBlogpost = ({ title, href, excerpt, ...blogmetaArgs }: CardBlogpostArgs) => html`
  <card-blogpost>
    <h2><a href=${href}>${title}</a></h2>
    ${CardBlogmeta(blogmetaArgs)}
    <p>${excerpt}</p>
  </card-blogpost>
`
```

Two components can legitimately import each other's render function (e.g. a card and the context provider it's demoed inside of — each needs to render the other for its own default story). This circular import is safe **only** because both sides call the imported function from inside a deferred render closure, never at module top level; ES module live bindings resolve correctly once both files finish evaluating. Keeping the cycle at the `.html.ts` level (instead of `.stories.ts`) also keeps `storybook/test` and other test-only imports out of the cycle.

### Reusable `argTypes`

If a render function's controls need to be merged into a composing component's own `argTypes` (e.g. `card-blogpost` folding in every `card-blogmeta` control), export the `argTypes` object from `.html.ts` too — but use `satisfies`, not a `: Meta<Args>["argTypes"]` annotation:

```typescript
// ✅ satisfies preserves the literal object type
export const blogmetaArgTypes = {
  author: { control: 'text', table: { category: 'Content' } },
  // ...
} satisfies Meta<CardBlogmetaArgs>['argTypes']

// ❌ this annotation widens to `X | undefined` (exactOptionalPropertyTypes),
// which then fails to satisfy another object's `argTypes` field once imported
// across a module boundary
export const blogmetaArgTypes: Meta<CardBlogmetaArgs>['argTypes'] = { /* ... */ }
```

---

## `component.stories.ts` — pure CSF

```typescript
import type { Meta, StoryObj } from '@storybook/web-components'
import { MyComponent, type MyComponentArgs } from './my-component.html'
import './my-component.ts'
import './my-component.css'

const meta: Meta<MyComponentArgs> = {
  title: 'Category/MyComponent',
  render: MyComponent,
  argTypes: {
    label: { control: 'text', table: { category: 'Reactive Properties' } },
    disabled: { control: 'boolean', table: { category: 'Reactive Properties' } },
  },
}
export default meta
type Story = StoryObj<MyComponentArgs>

export const Default: Story = {
  args: { label: 'Click me', disabled: false },
}
```

### `argTypes` categories

Group controls under `table: { category: '…' }` consistently:

| Category | For |
|---|---|
| `Reactive Properties` | Props declared in `expose()` — settable via prop or attribute |
| `Attributes` | Parser-initialized, connect-time-only config (form field `name`, breakpoints, `lang`) |
| `Classes` | Modifier classes selected via `control: { type: 'select' }` |
| `Content` | Slotted/child text or markup with no reactive prop behind it |

### Control-type gotchas

- **`control: 'color'`** works for any settable CSS-color-string prop (`value` on a color component) — the swatch preview may not render exotic formats like `oklch()`, but typing/pasting still works and the value round-trips correctly.
- **`control: 'date'`** returns an **epoch-millisecond number**, not an ISO string. Convert at both ends with small helpers (this project keeps them in `src/_common/storyArgs.ts`: `toISODate(timestamp)` / `timestamp(isoDateString)`) — write `Date` values with local (not UTC) getters so the round-trip doesn't shift by a day.

### When a story needs a genuinely different `render`

Only give a story its own `render:` when the DOM structure is **actually different** — a different field/element/attribute set, not just a different prop value:

```typescript
// ✅ Custom render: uses a <textarea> instead of <input>, different validation setup
export const WithTextarea: Story = {
  render: () => html`...`,
}

// ❌ Don't do this — same structure as Default, just different args.
// Use args on Default (or a new Story with only `args:`) instead.
export const Danger: Story = {
  render: () => html`<my-component variant="danger">...</my-component>`,
}
```

Mark genuine custom renders with a `// ⚠️ Custom render: <reason>` comment so a later pass can tell at a glance which stories are structurally justified.

### Shared, non-component-specific helpers

Utilities used by multiple components' stories (date/number converters, etc.) belong in `src/_common/`, imported normally — they're outside the `*.stories.ts` glob, so Storybook's CSF scanner never sees them and no `excludeStories` is needed.

---

## The Lit `ChildPart` crash — and how to avoid it

**Symptom:** `Error: This ChildPart has no parentNode and therefore cannot accept a value.` — thrown the *second* time a Storybook control changes (not the first).

**Cause:** Lit tracks a dynamic child (`${expr}`) with invisible marker comment nodes bracketing the rendered content. A component's own `el.textContent = value` (the default behavior of `bindText(el)`) overwrites that region directly, ejecting Lit's markers. The *next* time Storybook re-renders the story with new args, Lit tries to patch that same region in place — because Storybook mutates the existing mounted DOM rather than remounting — and finds its markers gone.

This only bites when a story's render function puts a Lit expression at the exact node the component's own JS also mutates directly, e.g.:

```typescript
// component.html.ts
html`<span class="label">${label}</span>`  // Lit owns this text node
```

```typescript
// component.ts
watch('label', bindText(labelEl))          // component ALSO owns it — conflict
```

**Fix:** tell the binding to preserve Lit's marker comments instead of wiping the whole node:

```typescript
watch('label', bindText(labelEl, true))                          // via bindText
watch('hex', (hex) => setTextPreservingComments(hexEl, hex))     // manual watch handler
```

Both `bindText(el, true)` and the standalone `setTextPreservingComments(element, text)` (also exported from `@zeix/le-truc`) only replace the text nodes between the markers, leaving the markers themselves intact.

**When you need this:** any time a story renders an arg as dynamic child *text* content (`<span>${arg}</span>`) inside an element the component also updates via `bindText`/`textContent`. You do **not** need it for attribute bindings (`class=${x}`, `value=${x}`) — attribute `Part`s in Lit aren't marker-based, so they coexist safely with a component's own attribute/property writes. Only child-text bindings collide.

---

## `observedAttributes()` — the Storybook/React interop escape hatch

By default (see `references/component-model.md`), a Parser-backed `expose()`d prop reads its attribute **once, at connect time**. This is correct for server-rendered, progressively-enhanced HTML — but it means a prop set via attribute will silently ignore any *later* attribute mutation.

That's exactly what breaks when a Storybook control (or a React wrapper, which always sets DOM attributes rather than properties) edits a prop after the element is already connected: Lit patches the attribute in place, but the component never re-parses it, so the UI looks unresponsive.

**Fix:** opt the specific attribute(s) into post-connect re-parsing with the `observedAttributes` extension, passed as `defineComponent`'s third argument:

```typescript
import { defineComponent, observedAttributes } from '@zeix/le-truc'

export default defineComponent<MyProps>(
  'my-component',
  ({ expose, /* ... */ }) => {
    expose({ value: asOklch() })
    // ...
  },
  [observedAttributes(['value'])],
)
```

This re-runs the *same* `Parser` retained from `expose()` against the attribute's new string value on every mutation. Notes:

- Only affects **Parser-backed** props (branded with `asParser()`, e.g. `asString()`, `asBoolean()`, `asOklch()`). Props initialized from DOM text content or other non-parser values are untouched — they were never attribute-driven in the first place.
- Combine with other extensions in the array; if `formAssociated()`/`formAssociatedCheckbox()` is present, it must come first.
- This is opt-in per attribute name, not global — list only the attributes that actually need it. Don't reach for it by default; it exists specifically for the interop case above.

**Do not add it to a prop the component reflects back onto the same attribute.** If a `watch()` handler in the component itself calls `bindAttribute(host, name)` or `host.setAttribute(name, ...)` for that prop, adding `observedAttributes([name])` creates a write → re-parse → write loop — le-truc throws `[Slot] Circular delegation detected in set()`. This is a real failure mode, not a hypothetical: it reproduces immediately in `module-pagination` (`value`/`max`, reflected via `host.setAttribute`) and `module-codeblock` (`collapsed`, reflected via `bindAttribute(host, 'collapsed')`) — both are intentionally left **without** `observedAttributes`, with a comment explaining why. If a component both reflects a prop to its host attribute *and* needs to pick up external attribute edits, that's a sign the attribute shouldn't be the single source of truth — don't reach for `observedAttributes` there.

### Regression-test this

Because this failure mode only shows up on the *second* render (attribute mutated after connect, not the initial one), a story with only static `args` never exercises it. Add a `play()` test that mutates the attribute directly, simulating what a control edit does:

```typescript
play: async ({ canvasElement }) => {
  const el = canvasElement.querySelector('my-component')
  el?.setAttribute('value', 'oklch(.7 .15 150)')
  await expect(canvas.getByText('#4cb86a')).toBeInTheDocument()
},
```

---

## Documentation (`.mdx`)

See `references/documentation.md` for the property/attribute/descendant table formats — those tables are what goes inside a component's `.mdx` file. Standard structure:

```mdx
import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks'
import * as MyComponentStories from './my-component.stories'

<Meta of={MyComponentStories} />

### My Component

One paragraph: what it does, which Le Truc patterns it demonstrates.

#### Tag Name

`my-component`

#### Preview

<Canvas of={MyComponentStories.Default} />

#### Controls

<Controls of={MyComponentStories.Default} />

#### Descendant Elements

<table>...</table>
```

Prefer `<Controls>` over a hand-written "Reactive Properties" table whenever every prop it would list is already a story control — it stays in sync automatically. Keep a hand-written table only for properties `<Controls>` can't show: `readonly` computed props, methods, provided contexts.

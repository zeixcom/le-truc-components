# Build Workflow

**Use when:** Creating a new Le Truc component.

**Required reading first:**
- `references/component-model.md` — factory form, reactivity flow, signal types
- `references/markup.md` — HTML structure, progressive enhancement
- `references/styling.md` — CSS scoping, custom properties, variants
- `references/storybook.md` — file layout, render-function conventions, Storybook/React interop pitfalls
- `references/documentation.md` — what to document and how

Read `references/effects.md` and `references/parsers.md` as you write TypeScript.
Read `references/coordination.md` if component needs to communicate with others.
Read `references/accessibility.md` for interactive/form widgets.

---

## Step 1: Plan

Before writing code, produce a brief plan and show it to the user. Include:

- **Component name(s):** tag name(s) in lowercase with hyphen
- **Responsibility:** one sentence per component
- **Props:** each reactive property, its type, initialization method
- **Elements:** which elements queried via `first`/`all`, which optional
- **Effects:** which `watch()`/`on()`/`pass()` drives which DOM update
- **Coordination:** how components communicate (see `references/coordination.md`)

**Wait for user confirmation before proceeding.**

---

## Step 2: Write TypeScript (`.ts`)

```typescript
import {
  asBoolean,
  asString,
  bindProperty,
  bindText,
  defineComponent,
} from '@zeix/le-truc'

// 1. Props type — all reactive property names and types
export type MyComponentProps = {
  disabled: boolean
  label: string
}

// 2. Global element registry (enables typed access)
declare global {
  interface HTMLElementTagNameMap {
    'my-component': HTMLElement & MyComponentProps
  }
}

// 3. Component definition
export default defineComponent<MyComponentProps>(
  'my-component',
  ({ expose, first, host, on, watch }) => {
    // Query the descendant that seeds expose()'s initial value.
    const button = first('button', 'Add a native <button> descendant.')

    // Declare reactive props — call expose() ONCE
    expose({
      disabled: asBoolean(),
      label: asString(button.textContent ?? ''),
    })

    // Button concern: click toggles disabled, disabled drives the property back
    on(button, 'click', () => ({ disabled: !host.disabled }))
    watch('disabled', bindProperty(button, 'disabled'))

    // Label concern: optional descendant
    const label = first('span.label')
    if (label) watch('label', bindText(label))
  },
)
```

**Rules:**
- Only import what you use
- Always provide `required` string to `first()` for essential elements
- Group statements by concern: put each `first()`/`all()` directly above the effect(s) that use it. Queries that seed `expose()`, or that feed several concerns, stay hoisted near the top. See `references/effects.md`
- Never call `first()`/`all()` inside an `on()`/`watch()` callback. Call them once in the factory body and capture the result in a `const`. See `references/anti-patterns.md`
- Use `if (element) watch(...)` for optional descendants
- Custom `watch` handlers with listeners/timers must return cleanup function
- Mark props `readonly` only if sensor-driven (not settable from outside)
- For a hand-authored `EffectDescriptor` wrapping a native API (`IntersectionObserver`, etc.), register it with `watch(() => true, descriptor)` — a bare thunk with no `watch()`/`return` never gets its cleanup called on disconnect

---

## Step 3: Write the Storybook Render Function (`.html.ts`)

**Required reading:** `references/storybook.md` — file layout, render-function conventions, the Lit `ChildPart` interop crash, and `observedAttributes()`.

```typescript
// my-component.html.ts
import { html, nothing } from 'lit'

export type MyComponentArgs = {
  label: string
  disabled: boolean
  variant: 'none' | 'primary'
}

export const MyComponent = ({ label, disabled, variant }: MyComponentArgs) => html`
  <my-component class=${variant !== 'none' ? variant : nothing} ?disabled=${disabled}>
    <button type="button" ?disabled=${disabled}><span class="label">${label}</span></button>
  </my-component>
`
```

**Rules:**
- Valid, functional markup — this is what Storybook mounts before/alongside the component's own JS (progressive enhancement in miniature)
- Use native semantic elements inside the custom element
- Args cover every meaningful state/variant combination the component supports
- Export the render function under a capitalized name (not the tag name) and export its `Args` type — both may be imported by other components' `.html.ts` files
- No Storybook imports here, and no `import "./my-component.ts"` / `.css` side effects — those belong in `.stories.ts`
- If a prop's dynamic value lands in an element's own child text (`<span>${label}</span>`) *and* the component also writes that text via `bindText`/`textContent`, the component needs `bindText(el, true)` (or `setTextPreservingComments`) — see `references/storybook.md`

---

## Step 4: Write CSS (`.css`)

```css
my-component {
  display: inline-block;

  & button {
    border: 1px solid var(--color-border);
    background-color: var(--color-secondary);
    cursor: pointer;
  }

  &.primary button {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }
}
```

**Rules:**
- Scope all rules to host element tag name
- Use CSS nesting (`& child`) for descendants
- Use design-token custom properties (`--color-*`, `--space-*`, `--font-size-*`)
- Variants via modifier classes on host

---

## Step 5: Write the Stories File (`.stories.ts`) and Docs (`.mdx`)

```typescript
// my-component.stories.ts
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
    variant: {
      control: { type: 'select' },
      options: ['none', 'primary'],
      table: { category: 'Classes' },
    },
  },
}
export default meta
type Story = StoryObj<MyComponentArgs>

export const Default: Story = {
  args: { label: 'Click me', disabled: false, variant: 'none' },
}
```

```mdx
{/* my-component.mdx */}
import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks'
import * as MyComponentStories from './my-component.stories'

<Meta of={MyComponentStories} />

### My Component

One paragraph describing what the component does and which patterns it demonstrates.

#### Tag Name

`my-component`

#### Preview

<Canvas of={MyComponentStories.Default} />

#### Controls

<Controls of={MyComponentStories.Default} />

#### Descendant Elements

| Selector | Type | Required | Description |
|---|---|---|---|
| `first('button')` | `HTMLButtonElement` | required | The interactive button |
| `first('span.label')` | `HTMLSpanElement` | required | Displays the label text |
```

See `references/storybook.md` for the render-function/CSF split and control conventions, and `references/documentation.md` for the table formats (used both inside `<Controls>`-adjacent hand-written tables and as the source of truth for what each control needs to say).

---

## Step 6: Verify

Run the project's test suite (check `package.json` for test command).

If no tests exist, follow `references/testing.md`.

---

## Success Criteria

- TypeScript: no type errors; all imports resolve; `Props` type explicit; `defineComponent` generic matches
- `.html.ts`: valid markup; works before JS; covers all states/variants; no Storybook imports; exported render function + `Args` type
- `.stories.ts`: pure CSF (no non-CSF exports needing `excludeStories`); controls grouped by category; genuine custom renders marked with `// ⚠️ Custom render: <reason>`
- CSS: all rules scoped to host; custom properties for design tokens; no hardcoded values
- `.mdx`: all required tables/`<Controls>` present; accurate types/defaults; Attributes section if using parsers
- Project test suite passes

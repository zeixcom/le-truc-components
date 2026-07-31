import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "./basic-button.ts";
import "./basic-button.css";
import type { BasicButtonProps } from "./basic-button.ts";

type BasicButtonArgs = {
  label: string;
  badge: string;
  disabled: boolean;
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "constructive"
    | "destructive";
  size: "small" | "medium" | "large";
  content: "spans" | "text";
};

const render = ({
  label,
  badge,
  disabled,
  variant,
  size,
  content,
}: BasicButtonArgs) => {
  const classes = [
    variant !== "secondary" ? variant : undefined,
    size !== "medium" ? size : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return html`
    <basic-button>
      <button
        type="button"
        class=${classes || nothing}
        ?disabled=${disabled}
      >${content === "text" ? label : html`<span class="label">${label}</span><span class="badge">${badge}</span>`}</button>
    </basic-button>
  `;
};

const meta: Meta<BasicButtonArgs> = {
  title: "Basic/Button",
  render,
  argTypes: {
    label: { control: "text", table: { category: "Reactive Properties" } },
    badge: { control: "text", table: { category: "Reactive Properties" } },
    disabled: {
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "Reactive Properties",
      },
    },
    variant: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "tertiary",
        "constructive",
        "destructive",
      ],
      table: { category: "Classes" },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      table: { category: "Classes" },
    },
    content: {
      control: { type: "select" },
      options: ["spans", "text"],
      description:
        "Whether the button renders `.label`/`.badge` spans (recommended) or plain text — `text` demonstrates the fallback to the button's own text content when the optional spans are absent",
      table: { category: "DOM Structure" },
    },
  },
};
export default meta;
type Story = StoryObj<BasicButtonArgs>;

export const Default: Story = {
  args: {
    label: "🛒 Shopping Cart",
    badge: "5",
    disabled: false,
    variant: "secondary",
    size: "medium",
    content: "spans",
  },
};

// disabled/label/badge are read once from DOM state at connect time — they are no longer
// attribute-parsed, so post-connect updates go through the property setters only.
export const DynamicUpdates: Story = {
  args: {
    label: "🛒 Shopping Cart",
    badge: "5",
    disabled: false,
    variant: "secondary",
    size: "medium",
    content: "spans",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;
    const button = el.querySelector("button");
    const label = el.querySelector(".label");
    const badge = el.querySelector(".badge");

    await expect(button).not.toBeDisabled();
    await expect(label).toHaveTextContent("🛒 Shopping Cart");
    await expect(badge).toHaveTextContent("5");

    el.disabled = true;
    await expect(button).toBeDisabled();

    el.disabled = false;
    await expect(button).not.toBeDisabled();

    el.label = "Wishlist";
    await expect(label).toHaveTextContent("Wishlist");

    el.badge = "10";
    await expect(badge).toHaveTextContent("10");

    el.disabled = true;
    el.label = "Back to Store";
    el.badge = "0";
    await expect(button).toBeDisabled();
    await expect(label).toHaveTextContent("Back to Store");
    await expect(badge).toHaveTextContent("0");
  },
};

// disabled attribute and span text content on the button seed the reactive properties —
// host attributes have no effect, since disabled/label/badge are read directly from
// descendant elements at connect time.
export const InitialDomState: Story = {
  args: {
    label: "Delete Item",
    badge: "99",
    disabled: true,
    variant: "destructive",
    size: "medium",
    content: "spans",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;

    await expect(el.querySelector("button")).toBeDisabled();
    await expect(el.querySelector(".label")).toHaveTextContent("Delete Item");
    await expect(el.querySelector(".badge")).toHaveTextContent("99");
    await expect(el.disabled).toBe(true);
    await expect(el.label).toBe("Delete Item");
    await expect(el.badge).toBe("99");
  },
};

export const PropertyChanges: Story = {
  args: {
    label: "🛒 Shopping Cart",
    badge: "5",
    disabled: false,
    variant: "secondary",
    size: "large",
    content: "spans",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;
    const button = el.querySelector("button");
    const label = el.querySelector(".label");
    const badge = el.querySelector(".badge");

    el.disabled = true;
    el.label = "Property Label";
    el.badge = "NEW";
    await expect(button).toBeDisabled();
    await expect(label).toHaveTextContent("Property Label");
    await expect(badge).toHaveTextContent("NEW");

    el.disabled = false;
    await expect(button).not.toBeDisabled();
  },
};

// content: "text" tests graceful handling when .label and .badge spans are absent
export const MissingOptionalElements: Story = {
  args: {
    label: "Just Button Text",
    badge: "",
    disabled: false,
    variant: "tertiary",
    size: "small",
    content: "text",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;
    const button = el.querySelector("button");

    await expect(button).not.toBeDisabled();
    await expect(button).toHaveTextContent("Just Button Text");

    el.disabled = true;
    await expect(button).toBeDisabled();
  },
};

// content: "text" tests label fallback to button text content when .label span is absent
export const TextFallback: Story = {
  args: {
    label: "Button Text Only",
    badge: "",
    disabled: false,
    variant: "primary",
    size: "medium",
    content: "text",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;
    const button = el.querySelector("button");

    await expect(el.label).toBe("Button Text Only");

    el.label = "New Label";
    // No .label span, so the button's own text content is unchanged
    await expect(button).toHaveTextContent("Button Text Only");
  },
};

// disabled is read from the button's own `disabled` property at connect time and set
// directly via the `disabled` property thereafter — no attribute parsing applies post-connect.
export const BooleanToggle: Story = {
  args: {
    label: "Boolean Test",
    badge: "Test",
    disabled: false,
    variant: "constructive",
    size: "medium",
    content: "spans",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;
    const button = el.querySelector("button");

    el.disabled = true;
    await expect(button).toBeDisabled();

    el.disabled = false;
    await expect(button).not.toBeDisabled();

    el.disabled = true;
    await expect(button).toBeDisabled();
  },
};

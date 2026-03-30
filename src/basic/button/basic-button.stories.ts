import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "./basic-button.ts";
import "./basic-button.css";
import type { Component } from "@zeix/le-truc";
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
};

const render = ({ label, badge, disabled, variant, size }: BasicButtonArgs) => {
  const classes = [
    variant !== "secondary" ? variant : undefined,
    size !== "medium" ? size : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return html`
    <basic-button ?disabled=${disabled} label=${label} badge=${badge}>
      <button type="button" class=${classes || nothing}>
        <span class="label">${label}</span>
        <span class="badge">${badge}</span>
      </button>
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
  },
};

// ⚠️ Custom render: tests attribute-driven updates on a button without initial label/badge in DOM
export const DynamicUpdates: Story = {
  render: () => html`
    <basic-button>
      <button type="button">
        <span class="label">🛒 Shopping Cart</span>
        <span class="badge">5</span>
      </button>
    </basic-button>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;
    const button = el.querySelector("button");
    const label = el.querySelector(".label");
    const badge = el.querySelector(".badge");

    await expect(button).not.toBeDisabled();
    await expect(label).toHaveTextContent("🛒 Shopping Cart");
    await expect(badge).toHaveTextContent("5");

    el.setAttribute("disabled", "true");
    await expect(button).toBeDisabled();

    el.removeAttribute("disabled");
    await expect(button).not.toBeDisabled();

    el.setAttribute("label", "Wishlist");
    await expect(label).toHaveTextContent("Wishlist");

    el.setAttribute("badge", "10");
    await expect(badge).toHaveTextContent("10");

    el.setAttribute("disabled", "true");
    el.setAttribute("label", "Back to Store");
    el.setAttribute("badge", "0");
    await expect(button).toBeDisabled();
    await expect(label).toHaveTextContent("Back to Store");
    await expect(badge).toHaveTextContent("0");
  },
};

// ⚠️ Custom render: tests that host attributes override mismatched initial DOM content
export const InitialAttributes: Story = {
  render: () => html`
    <basic-button disabled="true" label="Delete Item" badge="99">
      <button type="button" class="destructive">
        <span class="label">Default Label</span>
        <span class="badge">0</span>
      </button>
    </basic-button>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;

    await expect(el.querySelector("button")).toBeDisabled();
    await expect(el.querySelector(".label")).toHaveTextContent("Delete Item");
    await expect(el.querySelector(".badge")).toHaveTextContent("99");
  },
};

// ⚠️ Custom render: tests property assignment on a button with a class not derived from variant/size args
export const PropertyChanges: Story = {
  render: () => html`
    <basic-button>
      <button type="button" class="large">
        <span class="label">🛒 Shopping Cart</span>
        <span class="badge">5</span>
      </button>
    </basic-button>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;
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

// ⚠️ Custom render: tests graceful handling when .label and .badge spans are absent
export const MissingOptionalElements: Story = {
  render: () => html`
    <basic-button label="No Spans" badge="Missing">
      <button type="button" class="small tertiary">Just Button Text</button>
    </basic-button>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;
    const button = el.querySelector("button");

    await expect(button).not.toBeDisabled();
    await expect(button).toHaveTextContent("Just Button Text");

    el.setAttribute("disabled", "true");
    await expect(button).toBeDisabled();
  },
};

// ⚠️ Custom render: tests label fallback to button text content when .label span is absent
export const TextFallback: Story = {
  render: () => html`
    <basic-button>
      <button type="button" class="primary">Button Text Only</button>
    </basic-button>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;
    const button = el.querySelector("button");

    await expect(el.label).toBe("Button Text Only");

    el.setAttribute("label", "New Label");
    // No .label span, so the button's own text content is unchanged
    await expect(button).toHaveTextContent("Button Text Only");
  },
};

// ⚠️ Custom render: tests asBoolean attribute parsing edge cases (empty string, "false", "0", "disabled")
export const BooleanAttributes: Story = {
  render: () => html`
    <basic-button>
      <button type="button" class="constructive">
        <span class="label">Boolean Test</span>
        <span class="badge">Test</span>
      </button>
    </basic-button>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-button");
    const el = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;
    const button = el.querySelector("button");

    el.setAttribute("disabled", "");
    await expect(button).toBeDisabled();

    // asBoolean special case: "false" is the only string that returns false.
    // toBeDisabled() can't be used here: @testing-library/jest-dom walks ancestor
    // custom elements and treats any presence of the "disabled" attribute (regardless
    // of value) as disabling. Check the native button's own property instead.
    el.setAttribute("disabled", "false");
    await expect(button).not.toHaveAttribute("disabled");

    el.setAttribute("disabled", "disabled");
    await expect(button).toBeDisabled();

    // "0" is truthy in asBoolean, so disabled stays enabled
    el.setAttribute("disabled", "0");
    await expect(button).toBeDisabled();

    el.removeAttribute("disabled");
    await expect(button).not.toBeDisabled();
  },
};

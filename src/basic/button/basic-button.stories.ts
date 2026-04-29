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

// ⚠️ Custom render: tests graceful handling when .label and .badge spans are absent
export const MissingOptionalElements: Story = {
  render: () => html`
    <basic-button label="No Spans" badge="Missing">
      <button type="button" class="small tertiary">Just Button Text</button>
    </basic-button>
  `,
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

// ⚠️ Custom render: tests label fallback to button text content when .label span is absent
export const TextFallback: Story = {
  render: () => html`
    <basic-button>
      <button type="button" class="primary">Button Text Only</button>
    </basic-button>
  `,
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

import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "./card-colorscale.ts";
import "./card-colorscale.css";
import type { CardColorscaleProps } from "./card-colorscale.ts";

type CardColorscaleArgs = {
  name: string;
  color: string;
  variant: "none" | "tiny" | "small" | "medium" | "large";
};

const render = ({ name, color, variant }: CardColorscaleArgs) => html`
  <card-colorscale
    class=${variant !== "none" ? variant : nothing}
    color=${color}
  >
    <ol role="presentation">
      <li class="lighten80"></li>
      <li class="lighten60"></li>
      <li class="lighten40"></li>
      <li class="lighten20"></li>
      <li class="base">
        <span class="label">
          <strong>${name}</strong>
          <small></small>
        </span>
      </li>
      <li class="darken20"></li>
      <li class="darken40"></li>
      <li class="darken60"></li>
      <li class="darken80"></li>
    </ol>
  </card-colorscale>
`;

const meta: Meta<CardColorscaleArgs> = {
  title: "Card/Colorscale",
  render,
  argTypes: {
    name: {
      control: "text",
      table: {
        defaultValue: { summary: "Blue" },
        category: "Reactive Properties",
      },
    },
    color: {
      control: "text",
      description: "Oklch color string parsed at connect time",
      table: {
        defaultValue: { summary: "oklch(.48 .23 263)" },
        category: "Attributes",
      },
    },
    variant: {
      control: { type: "select" },
      options: ["none", "tiny", "small", "medium", "large"],
      table: {
        defaultValue: { summary: "none" },
        category: "Classes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<CardColorscaleArgs>;

export const Default: Story = {
  args: {
    name: "Blue",
    color: "oklch(.48 .23 263)",
    variant: "medium",
  },
};

const allVariants: CardColorscaleArgs[] = [
  { name: "Blue", color: "oklch(.48 .23 263)", variant: "tiny" },
  { name: "Blue", color: "oklch(.48 .23 263)", variant: "small" },
  { name: "Blue", color: "oklch(.48 .23 263)", variant: "medium" },
  { name: "Blue", color: "oklch(.48 .23 263)", variant: "large" },
];

export const AllVariants: Story = {
  render: () =>
    html`${allVariants.map((args) => html`${render(args)}<br />`)}`,
};

export const PropertyChanges: Story = {
  args: {
    name: "Blue",
    color: "oklch(.48 .23 263)",
    variant: "medium",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-colorscale");
    const el = canvasElement.querySelector(
      "card-colorscale",
    ) as HTMLElement & CardColorscaleProps;
    const labelSmall = el.querySelector(".label small");

    await expect(labelSmall?.textContent?.trim()).toMatch(/^#[0-9a-f]{6}$/i);
    await expect(el.style.getPropertyValue("--color-base")).not.toBe("");

    const initialHex = labelSmall?.textContent?.trim();
    el.color = { mode: "oklch", l: 0.55, c: 0.22, h: 29 };
    await expect(labelSmall?.textContent?.trim()).not.toBe(initialHex);
    await expect(labelSmall?.textContent?.trim()).toMatch(/^#[0-9a-f]{6}$/i);

    el.name = "Red";
    await expect(el.querySelector(".label strong")).toHaveTextContent("Red");
  },
};

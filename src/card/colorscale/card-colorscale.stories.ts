import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, within } from "storybook/test";
import { type CardColorscaleArgs, Colorscale } from "./card-colorscale.html";
import "./card-colorscale.ts";
import "./card-colorscale.css";

const meta: Meta<CardColorscaleArgs> = {
  title: "Card/Colorscale",
  render: Colorscale,
  argTypes: {
    value: {
      control: "color",
      description:
        "Base color — accepts any valid CSS color string (hex, named, <code>rgb()</code>, <code>hsl()</code>, <code>oklch()</code>, etc.), parsed internally into Oklch",
      table: { category: "Reactive Properties" },
    },
    label: {
      control: "text",
      description: "Display name of the color",
      table: { category: "Reactive Properties" },
    },
    size: {
      control: { type: "select" },
      options: ["tiny", "small", "medium", "large"],
      table: { category: "Classes" },
    },
  },
};
export default meta;
type Story = StoryObj<CardColorscaleArgs>;

export const Tiny: Story = {
  args: { value: "oklch(.48 .23 263)", label: "Blue", size: "tiny" },
};

export const Small: Story = {
  args: { value: "oklch(.48 .23 263)", label: "Blue", size: "small" },
};

export const Medium: Story = {
  args: { value: "oklch(.48 .23 263)", label: "Blue", size: "medium" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-colorscale");
    const canvas = within(canvasElement);
    // The hex label is computed from the parsed color.
    await expect(canvas.getByText(/^#[0-9a-f]{6}$/i)).toBeInTheDocument();

    // Simulates a Storybook control edit: the value attribute changes after
    // connect (not just at initial render), which only re-parses if
    // observedAttributes(["value"]) is wired up.
    const el = canvasElement.querySelector("card-colorscale");
    el?.setAttribute("value", "oklch(.7 .15 150)");
    await expect(canvas.getByText("#4cb86a")).toBeInTheDocument();
  },
};

export const Large: Story = {
  args: { value: "oklch(.48 .23 263)", label: "Blue", size: "large" },
};

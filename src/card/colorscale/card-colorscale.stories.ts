import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import "./card-colorscale.ts";
import "./card-colorscale.css";

type CardColorscaleArgs = {
  value: string;
  label: string;
  size: "tiny" | "small" | "medium" | "large";
};

// Exported so other components' stories can embed a colorscale instance via
// ${Colorscale(args)} instead of duplicating its markup.
export const Colorscale = ({ value, label, size }: CardColorscaleArgs) => html`
  <card-colorscale class=${size} value=${value}>
    <ol role="presentation">
      <li class="lighten80"></li>
      <li class="lighten60"></li>
      <li class="lighten40"></li>
      <li class="lighten20"></li>
      <li class="base">
        <span class="label">
          <strong>${label}</strong>
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
  render: Colorscale,
  // Colorscale is exported for reuse by other stories files, not a story itself.
  excludeStories: /^Colorscale$/,
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
  },
};

export const Large: Story = {
  args: { value: "oklch(.48 .23 263)", label: "Blue", size: "large" },
};

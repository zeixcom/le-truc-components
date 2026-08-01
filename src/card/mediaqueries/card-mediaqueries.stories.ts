import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import { Media } from "../../context/media/context-media.stories";
import "../../context/media/context-media.ts";
import "./card-mediaqueries.ts";

type CardMediaqueriesArgs = {
  heading: string;
};

// Exported so other components' stories can embed a mediaqueries instance via
// ${Mediaqueries(args)} instead of duplicating its markup.
export const Mediaqueries = ({ heading }: CardMediaqueriesArgs) => html`
  <card-mediaqueries>
    <h2>${heading}</h2>
    <dl>
      <dt>Motion Preference:</dt>
      <dd class="motion"></dd>
      <dt>Theme Preference:</dt>
      <dd class="theme"></dd>
      <dt>Device Viewport:</dt>
      <dd class="viewport"></dd>
      <dt>Device Orientation:</dt>
      <dd class="orientation"></dd>
    </dl>
  </card-mediaqueries>
`;

const meta: Meta<CardMediaqueriesArgs> = {
  title: "Card/Mediaqueries",
  render: Mediaqueries,
  // Mediaqueries is exported for reuse by other stories files, not a story itself.
  excludeStories: /^Mediaqueries$/,
  argTypes: {
    heading: {
      control: "text",
      table: { category: "Content" },
    },
  },
};
export default meta;
type Story = StoryObj<CardMediaqueriesArgs>;

export const WithoutContext: Story = {
  args: { heading: "Without Context" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-mediaqueries");
    const el = canvasElement.querySelector("card-mediaqueries");

    await expect(el?.querySelector(".motion")).toHaveTextContent("unknown");
    await expect(el?.querySelector(".theme")).toHaveTextContent("unknown");
    await expect(el?.querySelector(".viewport")).toHaveTextContent("unknown");
    await expect(el?.querySelector(".orientation")).toHaveTextContent(
      "unknown",
    );
  },
};

// ⚠️ Custom render: wraps the card inside a context-media provider to test that values are populated
export const WithContext: Story = {
  args: { heading: "With Context" },
  render: ({ heading }) =>
    Media({
      sm: "",
      md: "",
      lg: "",
      xl: "",
      content: Mediaqueries({ heading }),
    }),
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("context-media");
    await customElements.whenDefined("card-mediaqueries");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("card-mediaqueries");

    const motion = el?.querySelector(".motion");
    const theme = el?.querySelector(".theme");
    const viewport = el?.querySelector(".viewport");
    const orientation = el?.querySelector(".orientation");

    // Context values are live browser readings — just verify they are valid enum values
    await expect(motion).not.toHaveTextContent("unknown");
    await expect(theme).not.toHaveTextContent("unknown");
    await expect(viewport).not.toHaveTextContent("unknown");
    await expect(orientation).not.toHaveTextContent("unknown");

    await expect(canvas.getByText(/no-preference|reduce/)).toBeVisible();
    await expect(canvas.getByText(/light|dark/)).toBeVisible();
    await expect(canvas.getByText(/xs|sm|md|lg|xl/)).toBeVisible();
    await expect(canvas.getByText(/portrait|landscape/)).toBeVisible();
  },
};

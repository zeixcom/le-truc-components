import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import "../../context/media/context-media.ts";
import "./card-mediaqueries.ts";

type CardMediaqueriesArgs = {
  heading: string;
};

const cardTemplate = (heading: string) => html`
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

const render = ({ heading }: CardMediaqueriesArgs) => cardTemplate(heading);

const meta: Meta<CardMediaqueriesArgs> = {
  title: "Card/Mediaqueries",
  render,
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
  render: () => html`
    <context-media>
      ${cardTemplate("With Context")}
    </context-media>
  `,
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

// ⚠️ Custom render: renders two cards simultaneously — one inside context-media, one outside — to compare outputs
export const SideBySide: Story = {
  render: () => html`
    <context-media>
      ${cardTemplate("With Context")}
    </context-media>
    ${cardTemplate("Without Context (fallback)")}
  `,
};

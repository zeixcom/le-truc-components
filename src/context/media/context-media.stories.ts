import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import { Mediaqueries } from "../../card/mediaqueries/card-mediaqueries.html";
import { type ContextMediaArgs, Media } from "./context-media.html";
import "../../card/mediaqueries/card-mediaqueries.ts";
import "./context-media.ts";

const meta: Meta<ContextMediaArgs> = {
  title: "Context/Media",
  render: ({ sm, md, lg, xl }) =>
    Media({
      sm,
      md,
      lg,
      xl,
      content: Mediaqueries({ heading: "With Context" }),
    }),
  argTypes: {
    sm: {
      control: "text",
      description: "Min-width for the <code>sm</code> breakpoint.",
      table: { defaultValue: { summary: "32em" }, category: "Attributes" },
    },
    md: {
      control: "text",
      description: "Min-width for the <code>md</code> breakpoint.",
      table: { defaultValue: { summary: "48em" }, category: "Attributes" },
    },
    lg: {
      control: "text",
      description: "Min-width for the <code>lg</code> breakpoint.",
      table: { defaultValue: { summary: "72em" }, category: "Attributes" },
    },
    xl: {
      control: "text",
      description: "Min-width for the <code>xl</code> breakpoint.",
      table: { defaultValue: { summary: "104em" }, category: "Attributes" },
    },
  },
};
export default meta;
type Story = StoryObj<ContextMediaArgs>;

export const Default: Story = {
  args: { sm: "", md: "", lg: "", xl: "" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("context-media");
    await customElements.whenDefined("card-mediaqueries");
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector("card-mediaqueries");

    await expect(card?.querySelector(".motion")).not.toHaveTextContent(
      "unknown",
    );
    await expect(card?.querySelector(".theme")).not.toHaveTextContent(
      "unknown",
    );
    await expect(card?.querySelector(".viewport")).not.toHaveTextContent(
      "unknown",
    );
    await expect(card?.querySelector(".orientation")).not.toHaveTextContent(
      "unknown",
    );

    await expect(canvas.getByText(/no-preference|reduce/)).toBeVisible();
    await expect(canvas.getByText(/light|dark/)).toBeVisible();
    await expect(canvas.getByText(/xs|sm|md|lg|xl/)).toBeVisible();
    await expect(canvas.getByText(/portrait|landscape/)).toBeVisible();
  },
};

export const CustomBreakpoints: Story = {
  args: {
    sm: "40em",
    md: "60em",
    lg: "80em",
    xl: "120em",
  },
};

// ⚠️ Custom render: two differently-structured consumers (partial field subsets), not a prop variation of Mediaqueries
export const MultipleConsumers: Story = {
  render: () => html`
    <context-media>
      <card-mediaqueries>
        <h2>Consumer A</h2>
        <dl>
          <dt>Theme:</dt><dd class="theme"></dd>
          <dt>Viewport:</dt><dd class="viewport"></dd>
        </dl>
      </card-mediaqueries>
      <card-mediaqueries>
        <h2>Consumer B</h2>
        <dl>
          <dt>Motion:</dt><dd class="motion"></dd>
          <dt>Orientation:</dt><dd class="orientation"></dd>
        </dl>
      </card-mediaqueries>
    </context-media>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("context-media");
    await customElements.whenDefined("card-mediaqueries");
    const cards = canvasElement.querySelectorAll("card-mediaqueries");
    const [a, b] = Array.from(cards);

    // Both consumers receive values from the same provider
    if (a && b) {
      await expect(a.querySelector(".theme")).not.toHaveTextContent("unknown");
      await expect(a.querySelector(".viewport")).not.toHaveTextContent(
        "unknown",
      );
      await expect(b.querySelector(".motion")).not.toHaveTextContent("unknown");
      await expect(b.querySelector(".orientation")).not.toHaveTextContent(
        "unknown",
      );
    }
  },
};

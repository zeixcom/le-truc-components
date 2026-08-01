import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, within } from "storybook/test";
import { ContextMedia } from "../../context/media/context-media.html";
import {
  CardMediaqueries,
  type CardMediaqueriesArgs,
} from "./card-mediaqueries.html";
import "../../context/media/context-media.ts";
import "./card-mediaqueries.ts";

const meta: Meta<CardMediaqueriesArgs> = {
  title: "Card/Mediaqueries",
  render: CardMediaqueries,
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
    ContextMedia({
      sm: "",
      md: "",
      lg: "",
      xl: "",
      content: CardMediaqueries({ heading }),
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

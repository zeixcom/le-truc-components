import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { CemList } from "./module-cem-list.html";
import "./module-cem-list.ts";
import "./module-cem-list.css";
import "../../card/collapsible/card-collapsible.ts";
import "../../card/collapsible/card-collapsible.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";

const meta: Meta = {
  title: "Module/Cem List",
  render: CemList,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-cem-list");
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText(
      "Filter by name, tag, or description",
    );
    const cards = canvasElement.querySelectorAll("card-collapsible");
    await expect(cards.length).toBe(2);

    // Typing a term present only in the second card hides the first.
    await userEvent.type(input, "checkbox");
    await expect(cards[0]?.hidden).toBe(true);
    await expect(cards[1]?.hidden).toBe(false);
  },
};

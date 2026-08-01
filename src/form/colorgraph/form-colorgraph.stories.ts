import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import { Colorgraph, type FormColorgraphArgs } from "./form-colorgraph.html";
import "./form-colorgraph.ts";
import "./form-colorgraph.css";

const meta: Meta<FormColorgraphArgs> = {
  title: "Form/Colorgraph",
  render: ({ name, value }) => html`
    <form>${Colorgraph({ name, value })}</form>
  `,
  argTypes: {
    name: {
      control: "text",
      description: "Form field name",
      table: { category: "Attributes" },
    },
    value: {
      control: "color",
      description:
        "The selected color as a CSS string — accepts any valid CSS color string, parsed internally into Oklch. Form value.",
      table: { category: "Reactive Properties" },
    },
  },
};
export default meta;
type Story = StoryObj<FormColorgraphArgs>;

export const Default: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    // Initial value is parsed and reflected into the lightness input (0.48 → 48).
    const lightnessInput = canvas.getByLabelText(
      "Lightness",
    ) as HTMLInputElement;
    await expect(lightnessInput.value).toBe("48");
    const el = canvasElement.querySelector("form-colorgraph") as HTMLElement & {
      hue: number;
    };
    await expect(el.hue).toBeCloseTo(263, 0);
  },
};

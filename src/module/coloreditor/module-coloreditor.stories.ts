import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, within } from "storybook/test";
import {
  Coloreditor,
  type ModuleColoreditorArgs,
} from "./module-coloreditor.html";
import "./module-coloreditor.ts";
import "./module-coloreditor.css";
import "../../card/colorscale/card-colorscale.ts";
import "../../card/colorscale/card-colorscale.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";
import "../../form/colorgraph/form-colorgraph.ts";
import "../../form/colorgraph/form-colorgraph.css";
import "../colorinfo/module-colorinfo.ts";
import "../colorinfo/module-colorinfo.css";
import "../../basic/number/basic-number.ts";

const meta: Meta<ModuleColoreditorArgs> = {
  title: "Module/Coloreditor",
  render: Coloreditor,
  argTypes: {
    value: {
      control: "color",
      description:
        "Current color — accepts any valid CSS color string, parsed internally into Oklch",
      table: { category: "Reactive Properties" },
    },
    label: {
      control: "text",
      description: "Display name for the color",
      table: { category: "Reactive Properties" },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleColoreditorArgs>;

export const Default: Story = {
  args: {
    value: "oklch(.48 .23 263)",
    label: "Blue",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-coloreditor");
    await customElements.whenDefined("card-colorscale");
    await customElements.whenDefined("module-colorinfo");
    const canvas = within(canvasElement);
    // card-colorscale receives value/label from module-coloreditor via pass().
    await expect(canvas.getAllByText("Blue").length).toBeGreaterThan(0);
    // module-colorinfo.base receives its label ("Blue 500") via pass() —
    // only resolves if module-coloreditor's step-class selectors actually
    // match an element in the composed markup.
    const base = canvasElement.querySelector(
      "module-colorinfo.base",
    ) as HTMLElement & { label: string };
    await expect(base.label).toBe("Blue 500");
  },
};

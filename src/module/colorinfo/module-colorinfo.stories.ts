import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, within } from "storybook/test";
import { Colorinfo, type ModuleColorinfoArgs } from "./module-colorinfo.html";
import "./module-colorinfo.ts";
import "./module-colorinfo.css";
import "../../basic/number/basic-number.ts";

const meta: Meta<ModuleColorinfoArgs> = {
  title: "Module/Colorinfo",
  render: Colorinfo,
  argTypes: {
    value: {
      control: "color",
      description:
        "Color to inspect — accepts any valid CSS color string, parsed internally into Oklch",
      table: { category: "Reactive Properties" },
    },
    label: {
      control: "text",
      description: "Display name of the color swatch",
      table: { category: "Reactive Properties" },
    },
    open: {
      control: "boolean",
      description: "Whether the details are expanded by default",
      table: { category: "Attributes" },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleColorinfoArgs>;

export const Default: Story = {
  args: {
    value: "oklch(.48 .23 263)",
    label: "Blue",
    open: true,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-colorinfo");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-colorinfo",
    ) as HTMLElement & { label: string };
    // hex is derived from the oklch(.48 .23 263) input and rendered into .hex.
    await expect(canvas.getByText(/^#[0-9a-f]{6}$/i)).toBeInTheDocument();
    await expect(el.label).toBe("Blue");
  },
};

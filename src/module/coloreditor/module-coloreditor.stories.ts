import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, fireEvent, userEvent, within } from "storybook/test";
import {
  Coloreditor,
  type ModuleColoreditorArgs,
} from "./module-coloreditor.html";
import type { ModuleColoreditorProps } from "./module-coloreditor.ts";
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

    // Readonly computed props derived from `value`.
    const el = canvasElement.querySelector(
      "module-coloreditor",
    ) as HTMLElement & ModuleColoreditorProps;
    await expect(el.lightness).toBeCloseTo(0.48, 2);
    await expect(el.chroma).toBeCloseTo(0.23, 2);
    await expect(el.hue).toBeCloseTo(263, 0);
    await expect(el.nearest.length).toBeGreaterThan(0);

    // Every lighten/darken step is passed its own color/label, not just base.
    const lighten20 = canvasElement.querySelector(
      "module-colorinfo.lighten20",
    ) as HTMLElement & { label: string };
    await expect(lighten20.label).toBe("Blue 400");
    const darken40 = canvasElement.querySelector(
      "module-colorinfo.darken40",
    ) as HTMLElement & { label: string };
    await expect(darken40.label).toBe("Blue 700");
  },
};

export const NameFieldUpdatesLabel: Story = {
  args: {
    value: "oklch(.48 .23 263)",
    label: "Blue",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-coloreditor");
    await customElements.whenDefined("form-textbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-coloreditor",
    ) as HTMLElement & ModuleColoreditorProps;
    const nameInput = canvas.getByLabelText("Color name") as HTMLInputElement;

    await expect(el.label).toBe("Blue");

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Cerulean");
    await fireEvent.change(nameInput);

    await expect(el.label).toBe("Cerulean");
    const base = canvasElement.querySelector(
      "module-colorinfo.base",
    ) as HTMLElement & { label: string };
    await expect(base.label).toBe("Cerulean 500");
  },
};

export const AttributeMutation: Story = {
  args: {
    value: "oklch(.48 .23 263)",
    label: "Blue",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-coloreditor");
    const el = canvasElement.querySelector(
      "module-coloreditor",
    ) as HTMLElement & ModuleColoreditorProps;

    // Regression test for observedAttributes(['value', 'label']): a
    // Storybook Controls edit (or a React wrapper) sets the attribute after
    // connect, which must re-parse and propagate through pass() to the
    // composed card-colorscale/form-colorgraph/module-colorinfo instances.
    el.setAttribute("value", "oklch(.7 .1 30)");
    el.setAttribute("label", "Coral");
    await expect(el.hue).toBeCloseTo(30, 0);

    const base = canvasElement.querySelector(
      "module-colorinfo.base",
    ) as HTMLElement & { label: string; value: unknown };
    await expect(base.label).toBe("Coral 500");
  },
};

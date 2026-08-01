import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
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
import { Colorscale } from "../../card/colorscale/card-colorscale.html";
import { Colorgraph } from "../../form/colorgraph/form-colorgraph.html";
import { Colorinfo } from "../colorinfo/module-colorinfo.stories";

type ModuleColoreditorArgs = {
  value: string;
  label: string;
};

// Mirrors the module-colorinfo.{lighten*,base,darken*} selectors
// module-coloreditor.ts queries to pass() each step's color/label.
const INFO_STEPS: { cls: string; weight: number; open: boolean }[] = [
  { cls: "lighten80", weight: 100, open: false },
  { cls: "lighten60", weight: 200, open: false },
  { cls: "lighten40", weight: 300, open: false },
  { cls: "lighten20", weight: 400, open: false },
  { cls: "base", weight: 500, open: true },
  { cls: "darken20", weight: 600, open: false },
  { cls: "darken40", weight: 700, open: false },
  { cls: "darken60", weight: 800, open: false },
  { cls: "darken80", weight: 900, open: false },
];

const render = ({ value, label }: ModuleColoreditorArgs) => html`
  <module-coloreditor value=${value} label=${label}>
    ${Colorscale({ value, label, size: "tiny" })}
    <form-textbox class="name">
      <label for="name-input">Color name</label>
      <div class="input">
        <input
          type="text"
          id="name-input"
          name="name"
          value=${label}
          autocomplete="off"
          required
        />
      </div>
      <p class="error" aria-live="assertive" id="name-error"></p>
      <p class="description" aria-live="polite" id="name-description"></p>
    </form-textbox>
    ${Colorgraph({ name: "", value })}
    <div class="info">
      ${INFO_STEPS.map(({ cls, weight, open }) =>
        Colorinfo({ value, label: `${label} ${weight}`, open, class: cls }),
      )}
    </div>
  </module-coloreditor>
`;

const meta: Meta<ModuleColoreditorArgs> = {
  title: "Module/Coloreditor",
  render,
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

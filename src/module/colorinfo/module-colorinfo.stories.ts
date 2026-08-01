import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect, within } from "storybook/test";
import "./module-colorinfo.ts";
import "./module-colorinfo.css";
import "../../basic/number/basic-number.ts";

type ModuleColorinfoArgs = {
  value: string;
  label: string;
  open: boolean;
  /** Optional class, e.g. one of the lighten/darken/base step selectors module-coloreditor queries. */
  class?: string;
};

// Exported so other components' stories can embed a colorinfo instance via
// ${Colorinfo(args)} instead of duplicating its markup.
export const Colorinfo = ({
  value,
  label,
  open,
  class: cls,
}: ModuleColorinfoArgs) => html`
  <module-colorinfo class=${cls || nothing} value=${value}>
    <details ?open=${open}>
      <summary>
        <div class="summary">
          <span class="swatch"></span>
          <span class="label">
            <strong>${label}</strong>
            <small class="hex"></small>
          </span>
        </div>
      </summary>
      <div class="details">
        <dl>
          <dt>Lightness:</dt>
          <dd>
            <basic-number
              class="lightness"
              options='{"style":"percent","maximumFractionDigits":2}'
            ></basic-number>
          </dd>
          <dt>Chroma:</dt>
          <dd>
            <basic-number
              class="chroma"
              options='{"maximumFractionDigits":4}'
            ></basic-number>
          </dd>
          <dt>Hue:</dt>
          <dd>
            <basic-number
              class="hue"
              options='{"maximumFractionDigits":2}'
            ></basic-number>
          </dd>
        </dl>
        <dl>
          <dt>OKLCH:</dt>
          <dd lang="en">
            oklch(<basic-number
              class="lightness"
              options='{"maximumFractionDigits":4}'
            ></basic-number>
            <basic-number
              class="chroma"
              options='{"maximumFractionDigits":4}'
            ></basic-number>
            <basic-number
              class="hue"
              options='{"maximumFractionDigits":2}'
            ></basic-number
            >)
          </dd>
          <dt>RGB:</dt>
          <dd class="rgb"></dd>
          <dt>HSL:</dt>
          <dd class="hsl"></dd>
        </dl>
      </div>
    </details>
  </module-colorinfo>
`;

const meta: Meta<ModuleColorinfoArgs> = {
  title: "Module/Colorinfo",
  render: Colorinfo,
  // Colorinfo is exported for reuse by other stories files, not a story itself.
  excludeStories: /^Colorinfo$/,
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

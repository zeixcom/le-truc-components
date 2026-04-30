import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect } from "storybook/test";
import "./module-colorinfo.ts";
import "./module-colorinfo.css";
import "../../basic/number/basic-number.ts";
import type { ModuleColorinfoProps } from "./module-colorinfo.ts";

type ModuleColorinfoArgs = {
  name: string;
  color: string;
};

const render = ({ name, color }: ModuleColorinfoArgs) => html`
  <module-colorinfo color=${color}>
    <details open>
      <summary>
        <div class="summary">
          <span class="swatch"></span>
          <span class="label">
            <strong>${name}</strong>
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
  title: "Module/Color Info",
  render,
  argTypes: {
    name: {
      control: "text",
      table: {
        defaultValue: { summary: "Blue" },
        category: "Reactive Properties",
      },
    },
    color: {
      control: "text",
      description: "Oklch color string parsed at connect time",
      table: {
        defaultValue: { summary: "oklch(.48 .23 263)" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleColorinfoArgs>;

export const Default: Story = {
  args: {
    name: "Blue",
    color: "oklch(.48 .23 263)",
  },
};

export const Red: Story = {
  args: {
    name: "Red",
    color: "oklch(.55 .22 29)",
  },
};

export const PropertyChanges: Story = {
  args: {
    name: "Blue",
    color: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-colorinfo");
    const el = canvasElement.querySelector(
      "module-colorinfo",
    ) as HTMLElement & ModuleColorinfoProps;
    const hexEl = canvasElement.querySelector(".hex");

    await expect(hexEl?.textContent?.trim()).toMatch(/^#[0-9a-f]{6}$/i);

    const initialHex = el.hex;
    el.color = { mode: "oklch", l: 0.7, c: 0.15, h: 120 };
    await expect(el.hex).not.toBe(initialHex);
    await expect(hexEl?.textContent?.trim()).toMatch(/^#[0-9a-f]{6}$/i);

    el.name = "Green";
    const labelStrong = canvasElement.querySelector(".label strong");
    await expect(labelStrong).toHaveTextContent("Green");
  },
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import "./module-colorinfo.ts";
import "./module-colorinfo.css";
import "../../basic/number/basic-number.ts";

const render = () => html`
  <module-colorinfo color="oklch(.48 .23 263)">
    <details open>
      <summary>
        <div class="summary">
          <span class="swatch"></span>
          <span class="label">
            <strong>Blue</strong>
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

const meta: Meta = {
  title: "Module/Colorinfo",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-colorinfo");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-colorinfo",
    ) as HTMLElement & { name: string };
    // hex is derived from the oklch(.48 .23 263) input and rendered into .hex.
    await expect(canvas.getByText(/^#[0-9a-f]{6}$/i)).toBeInTheDocument();
    await expect(el.name).toBe("Blue");
  },
};

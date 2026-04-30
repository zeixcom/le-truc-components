import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect } from "storybook/test";
import "./form-colorgraph.ts";
import "./form-colorgraph.css";
import type { FormColorgraphProps } from "./form-colorgraph.ts";

type FormColorgraphArgs = {
  color: string;
};

const render = ({ color }: FormColorgraphArgs) => html`
  <form-colorgraph color=${color}>
    <div class="graph">
      <canvas width="400" height="400"></canvas>
      <button type="button" class="knob">
        <span class="visually-hidden">Drag</span>
      </button>
      <ol role="presentation">
        <li class="lighten80"></li>
        <li class="lighten60"></li>
        <li class="lighten40"></li>
        <li class="lighten20"></li>
        <li class="darken20"></li>
        <li class="darken40"></li>
        <li class="darken60"></li>
        <li class="darken80"></li>
      </ol>
    </div>
    <div
      class="slider"
      role="slider"
      tabindex="0"
      aria-valuenow="0"
      aria-valuemin="0"
      aria-valuemax="0.4"
      aria-controls="hue"
      aria-labelledby="hue-label"
    >
      <canvas width="360" height="1"></canvas>
      <span class="thumb"></span>
    </div>
    <div class="lightness">
      <label for="lightness">Lightness</label>
      <div class="input">
        <input id="lightness" name="lightness" type="number" />
        <span class="unit">%</span>
      </div>
      <div class="buttons">
        <button
          type="button"
          class="decrement"
          aria-label="Decrement lightness"
        >
          −
        </button>
        <button
          type="button"
          class="increment"
          aria-label="Increment lightness"
        >
          +
        </button>
      </div>
      <p class="error" aria-live="assertive" id="lightness-error"></p>
    </div>
    <div class="chroma">
      <label for="chroma">Chroma</label>
      <div class="input">
        <input id="chroma" name="chroma" type="number" />
      </div>
      <div class="buttons">
        <button type="button" class="decrement" aria-label="Decrement chroma">
          −
        </button>
        <button type="button" class="increment" aria-label="Increment chroma">
          +
        </button>
      </div>
      <p class="error" aria-live="assertive" id="chroma-error"></p>
    </div>
    <div class="hue">
      <label id="hue-label" for="hue">Hue</label>
      <div class="input">
        <input id="hue" name="hue" type="number" />
        <span class="unit">°</span>
      </div>
      <div class="buttons">
        <button type="button" class="decrement" aria-label="Decrement hue">
          −
        </button>
        <button type="button" class="increment" aria-label="Increment hue">
          +
        </button>
      </div>
      <p class="error" aria-live="assertive" id="hue-error"></p>
    </div>
  </form-colorgraph>
`;

const meta: Meta<FormColorgraphArgs> = {
  title: "Form/Colorgraph",
  render,
  argTypes: {
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
type Story = StoryObj<FormColorgraphArgs>;

export const Default: Story = {
  args: {
    color: "oklch(.48 .23 263)",
  },
};

export const Red: Story = {
  args: {
    color: "oklch(.55 .22 29)",
  },
};

export const Green: Story = {
  args: {
    color: "oklch(.55 .17 145)",
  },
};

export const PropertyChanges: Story = {
  args: {
    color: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const el = canvasElement.querySelector("form-colorgraph") as HTMLElement &
      FormColorgraphProps;

    await expect(el.lightness).toBeCloseTo(0.48, 1);
    await expect(el.chroma).toBeCloseTo(0.23, 1);
    await expect(el.hue).toBeCloseTo(263, 0);

    const initialLightness = el.lightness;
    el.stepDown("l");
    await expect(el.lightness).toBeLessThan(initialLightness);

    el.stepUp("l", true);
    await expect(el.lightness).toBeGreaterThan(initialLightness);
  },
};

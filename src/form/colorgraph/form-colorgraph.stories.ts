import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import "./form-colorgraph.ts";
import "./form-colorgraph.css";

const render = () => html`
  <form>
    <form-colorgraph name="color" value="oklch(.48 .23 263)">
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
        aria-valuemax="360"
        aria-controls="hue"
        aria-labelledby="hue-label"
      >
        <canvas width="360" height="1"></canvas>
        <span class="thumb"></span>
      </div>
      <div class="lightness">
        <label for="lightness">Lightness</label>
        <div class="input">
          <input id="lightness" type="number" />
          <span class="unit">%</span>
        </div>
        <div class="buttons">
          <button type="button" class="decrement" aria-label="Decrement lightness">
            −
          </button>
          <button type="button" class="increment" aria-label="Increment lightness">
            +
          </button>
        </div>
        <p class="error" aria-live="assertive" id="lightness-error"></p>
      </div>
      <div class="chroma">
        <label for="chroma">Chroma</label>
        <div class="input">
          <input id="chroma" type="number" />
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
          <input id="hue" type="number" />
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
  </form>
`;

const meta: Meta = {
  title: "Form/Colorgraph",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-colorgraph") as any;
    // Initial value is parsed and reflected into the lightness input (0.48 → 48).
    const lightnessInput = canvas.getByLabelText(
      "Lightness",
    ) as HTMLInputElement;
    await expect(lightnessInput.value).toBe("48");
    await expect(el.hue).toBeCloseTo(263, 0);
  },
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
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

// The <dl> block is repeated 9× (once per color step). A helper keeps it DRY.
const detailsDl = () => html`
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
`;

const colorinfo = (cls: string, open = false) => html`
  <module-colorinfo class=${cls}>
    <details ?open=${open}>
      <summary>
        <div class="summary">
          <span class="swatch"></span>
          <span class="label">
            <strong></strong>
            <small class="hex"></small>
          </span>
        </div>
      </summary>
      ${detailsDl()}
    </details>
  </module-colorinfo>
`;

const render = () => html`
  <module-coloreditor color="oklch(.48 .23 263)" name="Blue">
    <card-colorscale class="scale tiny">
      <ol role="presentation">
        <li class="lighten80"></li>
        <li class="lighten60"></li>
        <li class="lighten40"></li>
        <li class="lighten20"></li>
        <li class="base">
          <span class="label">
            <strong></strong>
            <small></small>
          </span>
        </li>
        <li class="darken20"></li>
        <li class="darken40"></li>
        <li class="darken60"></li>
        <li class="darken80"></li>
      </ol>
    </card-colorscale>
    <form-textbox class="name">
      <label for="name-input">Color name</label>
      <div class="input">
        <input
          type="text"
          id="name-input"
          name="name"
          value="Blue"
          autocomplete="off"
          required
        />
      </div>
      <p class="error" aria-live="assertive" id="name-error"></p>
      <p class="description" aria-live="polite" id="name-description"></p>
    </form-textbox>
    <form-colorgraph>
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
          <input id="lightness" name="lightness" type="number" />
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
    <div class="info">
      ${colorinfo("lighten80")}
      ${colorinfo("lighten60")}
      ${colorinfo("lighten40")}
      ${colorinfo("lighten20")}
      ${colorinfo("base", true)}
      ${colorinfo("darken20")}
      ${colorinfo("darken40")}
      ${colorinfo("darken60")}
      ${colorinfo("darken80")}
    </div>
  </module-coloreditor>
`;

const meta: Meta = {
  title: "Module/Coloreditor",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

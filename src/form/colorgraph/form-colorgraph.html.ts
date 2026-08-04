import { html } from "lit";

export type FormColorgraphArgs = {
  name: string;
  value: string;
};

// Exported so other components' stories can embed a colorgraph instance via
// ${FormColorgraph(args)} instead of duplicating its markup.
export const FormColorgraph = ({ name, value }: FormColorgraphArgs) => html`
  <form-colorgraph name=${name} value=${value}>
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
    <p class="error" aria-live="assertive" id="color-error"></p>
    <div class="axis lightness">
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
    <div class="axis chroma">
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
    <div class="axis hue">
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
`;

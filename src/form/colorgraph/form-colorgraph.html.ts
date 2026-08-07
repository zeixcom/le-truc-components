import { html } from "lit";
import { FormSpinbutton } from "../spinbutton/form-spinbutton.html";

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
    ${FormSpinbutton({
      className: "lightness",
      id: "lightness",
      label: "Lightness",
      unit: "%",
      value: 0,
      min: 0,
      max: 100,
      step: 0.25,
      bigStep: 5,
      decrementLabel: "Decrement lightness",
      incrementLabel: "Increment lightness",
      errorId: "lightness-error",
    })}
    ${FormSpinbutton({
      className: "chroma",
      id: "chroma",
      label: "Chroma",
      value: 0,
      min: 0,
      max: 0.4,
      step: 0.001,
      bigStep: 0.02,
      decrementLabel: "Decrement chroma",
      incrementLabel: "Increment chroma",
      errorId: "chroma-error",
    })}
    ${FormSpinbutton({
      className: "hue",
      id: "hue",
      label: "Hue",
      labelId: "hue-label",
      unit: "°",
      value: 0,
      min: 0,
      max: 360,
      step: 0.01,
      bigStep: 15,
      decrementLabel: "Decrement hue",
      incrementLabel: "Increment hue",
      errorId: "hue-error",
    })}
  </form-colorgraph>
`;

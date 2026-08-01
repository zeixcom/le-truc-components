import { html, nothing } from "lit";

export type ModuleColorinfoArgs = {
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

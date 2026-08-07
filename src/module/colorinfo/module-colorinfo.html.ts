import { html, nothing } from "lit";
import { BasicNumber } from "../../basic/number/basic-number.html";

export type ModuleColorinfoArgs = {
  value: string;
  label: string;
  open: boolean;
  /** Optional class, e.g. one of the lighten/darken/base step selectors module-coloreditor queries. */
  class?: string;
};

// Exported so other components' stories can embed a colorinfo instance via
// ${ModuleColorinfo(args)} instead of duplicating its markup.
export const ModuleColorinfo = ({
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
            ${BasicNumber({
              class: "lightness",
              options: '{"style":"percent","maximumFractionDigits":2}',
            })}
          </dd>
          <dt>Chroma:</dt>
          <dd>
            ${BasicNumber({
              class: "chroma",
              options: '{"maximumFractionDigits":4}',
            })}
          </dd>
          <dt>Hue:</dt>
          <dd>
            ${BasicNumber({
              class: "hue",
              options: '{"maximumFractionDigits":2}',
            })}
          </dd>
        </dl>
        <dl>
          <dt>OKLCH:</dt>
          <dd lang="en">
            oklch(${BasicNumber({
              class: "lightness",
              options: '{"maximumFractionDigits":4}',
            })}
            ${BasicNumber({
              class: "chroma",
              options: '{"maximumFractionDigits":4}',
            })}
            ${BasicNumber({
              class: "hue",
              options: '{"maximumFractionDigits":2}',
            })})
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

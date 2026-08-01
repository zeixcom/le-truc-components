import { html } from "lit";
import { Colorscale } from "../../card/colorscale/card-colorscale.html";
import { Colorgraph } from "../../form/colorgraph/form-colorgraph.html";
import { Colorinfo } from "../colorinfo/module-colorinfo.html";

export type ModuleColoreditorArgs = {
  value: string;
  label: string;
};

// Mirrors the module-colorinfo.{lighten*,base,darken*} selectors
// module-coloreditor.ts queries to pass() each step's color/label.
const INFO_STEPS: { cls: string; weight: number; open: boolean }[] = [
  { cls: "lighten80", weight: 100, open: false },
  { cls: "lighten60", weight: 200, open: false },
  { cls: "lighten40", weight: 300, open: false },
  { cls: "lighten20", weight: 400, open: false },
  { cls: "base", weight: 500, open: true },
  { cls: "darken20", weight: 600, open: false },
  { cls: "darken40", weight: 700, open: false },
  { cls: "darken60", weight: 800, open: false },
  { cls: "darken80", weight: 900, open: false },
];

export const Coloreditor = ({ value, label }: ModuleColoreditorArgs) => html`
  <module-coloreditor value=${value} label=${label}>
    ${Colorscale({ value, label, size: "tiny" })}
    <form-textbox class="name">
      <label for="name-input">Color name</label>
      <div class="input">
        <input
          type="text"
          id="name-input"
          name="name"
          value=${label}
          autocomplete="off"
          required
        />
      </div>
      <p class="error" aria-live="assertive" id="name-error"></p>
      <p class="description" aria-live="polite" id="name-description"></p>
    </form-textbox>
    ${Colorgraph({ name: "", value })}
    <div class="info">
      ${INFO_STEPS.map(({ cls, weight, open }) =>
        Colorinfo({ value, label: `${label} ${weight}`, open, class: cls }),
      )}
    </div>
  </module-coloreditor>
`;

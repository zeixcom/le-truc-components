import { html } from "lit";
import { CardColorscale } from "../../card/colorscale/card-colorscale.html";
import { FormColorgraph } from "../../form/colorgraph/form-colorgraph.html";
import { FormTextbox } from "../../form/textbox/form-textbox.html";
import { ModuleColorinfo } from "../colorinfo/module-colorinfo.html";

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

export const ModuleColoreditor = ({
  value,
  label,
}: ModuleColoreditorArgs) => html`
  <module-coloreditor value=${value} label=${label}>
    ${CardColorscale({ value, label, size: "tiny" })}
    ${FormTextbox({
      hostClass: "name",
      label: "Color name",
      value: label,
      autocomplete: "off",
      description: "",
    })}
    ${FormColorgraph({ name: "", value })}
    <div class="info">
      ${INFO_STEPS.map(({ cls, weight, open }) =>
        ModuleColorinfo({
          value,
          label: `${label} ${weight}`,
          open,
          class: cls,
        }),
      )}
    </div>
  </module-coloreditor>
`;

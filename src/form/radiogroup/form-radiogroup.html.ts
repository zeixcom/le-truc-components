import { html, nothing } from "lit";

export type FormRadiogroupArgs = {
  value: string;
  variant: "none" | "radio-group" | "split-button";
};

// Exported so other components' stories can embed a radiogroup instance via
// ${FormRadiogroup(args)} instead of duplicating its markup.
export const FormRadiogroup = ({ value, variant }: FormRadiogroupArgs) => html`
  <form-radiogroup class=${variant !== "none" ? variant : nothing}>
    <fieldset>
      <legend>Theme</legend>
      <label class=${value === "light" ? "selected" : nothing}>
        <input type="radio" class="visually-hidden" name="theme" value="light" ?checked=${value === "light"} />
        <span>Light</span>
      </label>
      <label class=${value === "dark" ? "selected" : nothing}>
        <input type="radio" class="visually-hidden" name="theme" value="dark" ?checked=${value === "dark"} />
        <span>Dark</span>
      </label>
      <label class=${value === "system" ? "selected" : nothing}>
        <input type="radio" class="visually-hidden" name="theme" value="system" ?checked=${value === "system"} />
        <span>System</span>
      </label>
    </fieldset>
  </form-radiogroup>
`;

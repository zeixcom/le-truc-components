import { html, nothing } from "lit";

export type FormCheckboxArgs = {
  checked: boolean;
  label: string;
  variant: "none" | "checkbox" | "todo" | "toggle";
};

// Exported so other components' stories can embed a checkbox instance via
// ${FormCheckbox(args)} instead of duplicating its markup.
export const FormCheckbox = ({
  checked,
  label,
  variant,
}: FormCheckboxArgs) => html`
  <form-checkbox class=${variant !== "none" ? variant : nothing} ?checked=${checked}>
    <label>
      <input
        type="checkbox"
        class=${variant !== "none" ? "visually-hidden" : nothing}
        ?checked=${checked}
      />
      <span class="label">${label}</span>
    </label>
  </form-checkbox>
`;

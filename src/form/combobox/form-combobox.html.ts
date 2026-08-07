import { html } from "lit";
import { FormListbox } from "../listbox/form-listbox.html";

export type FormComboboxArgs = {
  value: string;
  description: string;
};

// Exported so other components' stories can embed a combobox instance via
// ${FormCombobox(args)} instead of duplicating its markup.
export const FormCombobox = ({ value, description }: FormComboboxArgs) => html`
  <form-combobox>
    <label for="color-input" id="color-label">Favourite color</label>
    <div class="input">
      <input
        id="color-input"
        type="text"
        name="color"
        role="combobox"
        aria-expanded="false"
        aria-controls="color-popup"
        aria-autocomplete="list"
        autocomplete="off"
        value=${value}
      />
      ${FormListbox({
        id: "color-popup",
        name: "",
        ariaLabelledby: "color-label",
        wrapInForm: false,
        showSelected: false,
      })}
    </div>
    <p class="error" role="alert" aria-live="assertive" id="color-error"></p>
    <p class="description" aria-live="polite" id="color-description">${description}</p>
  </form-combobox>
`;

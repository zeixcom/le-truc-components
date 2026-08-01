import { html } from "lit";

export type FormComboboxArgs = {
  value: string;
  description: string;
};

// Exported so other components' stories can embed a combobox instance via
// ${Combobox(args)} instead of duplicating its markup.
export const Combobox = ({ value, description }: FormComboboxArgs) => html`
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
      <form-listbox id="color-popup">
        <div role="listbox" aria-labelledby="color-label">
          <button type="button" role="option" tabindex="-1" value="red">Red</button>
          <button type="button" role="option" tabindex="-1" value="green">Green</button>
          <button type="button" role="option" tabindex="-1" value="blue">Blue</button>
          <button type="button" role="option" tabindex="-1" value="yellow">Yellow</button>
          <button type="button" role="option" tabindex="-1" value="purple">Purple</button>
        </div>
      </form-listbox>
    </div>
    <p class="error" role="alert" aria-live="assertive" id="color-error"></p>
    <p class="description" aria-live="polite" id="color-description">${description}</p>
  </form-combobox>
`;

import { html, nothing } from "lit";

export type FormTextboxArgs = {
  description: string;
  clearable: boolean;
};

// Exported so other components' stories can embed a textbox instance via
// ${Textbox(args)} instead of duplicating its markup.
export const Textbox = ({ description, clearable }: FormTextboxArgs) => html`
  <form-textbox>
    <label for="name-input">Name</label>
    <div class="input">
      <input type="text" id="name-input" name="name" autocomplete="name" required />
      ${clearable ? html`<button type="button" class="clear" aria-label="Clear input" hidden>✕</button>` : nothing}
    </div>
    <p class="error" role="alert" aria-live="assertive" id="name-error"></p>
    <p class="description" aria-live="polite" id="name-description">${description}</p>
  </form-textbox>
`;

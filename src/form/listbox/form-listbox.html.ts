import { html, nothing } from "lit";

export type FormListboxArgs = {
  value: string;
  filter: string;
  src: string;
};

// Exported so other components' stories can embed a listbox instance via
// ${Listbox(args)} instead of duplicating its markup.
export const Listbox = ({ value }: FormListboxArgs) => html`
  <form>
    <form-listbox id="colors" name="color">
      <div role="listbox" aria-label="Colors">
        <button type="button" role="option" tabindex="-1" value="red" aria-selected=${value === "red" ? "true" : nothing}>Red</button>
        <button type="button" role="option" tabindex="-1" value="green" aria-selected=${value === "green" ? "true" : nothing}>Green</button>
        <button type="button" role="option" tabindex="-1" value="blue" aria-selected=${value === "blue" ? "true" : nothing}>Blue</button>
        <button type="button" role="option" tabindex="-1" value="yellow" aria-selected=${value === "yellow" ? "true" : nothing}>Yellow</button>
        <button type="button" role="option" tabindex="-1" value="purple" aria-selected=${value === "purple" ? "true" : nothing}>Purple</button>
      </div>
    </form-listbox>
  </form>
`;

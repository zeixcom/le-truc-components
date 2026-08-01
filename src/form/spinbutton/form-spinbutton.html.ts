import { html } from "lit";

export type FormSpinbuttonArgs = {
  value: number;
  max: number;
};

// Exported so other components' stories can embed a spinbutton instance via
// ${Spinbutton(args)} instead of duplicating its markup.
export const Spinbutton = ({ value, max }: FormSpinbuttonArgs) => html`
  <form-spinbutton>
    <button type="button" class="decrement" aria-label="Decrement" ?hidden=${value === 0}>−</button>
    <input
      type="number"
      class="value"
      name="amount"
      value=${value}
      min="0"
      max=${max}
      aria-label="Quantity"
      readonly
      disabled
      ?hidden=${value === 0}
    />
    <button type="button" class="increment" aria-label="Increment">
      <span class="zero" ?hidden=${value !== 0}>Add to Cart</span>
      <span class="other" ?hidden=${value === 0}>+</span>
    </button>
  </form-spinbutton>
`;

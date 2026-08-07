import { html, nothing } from "lit";

export type FormSpinbuttonArgs = {
  /** Form field name (submitted value key). Omit when the host doesn't need its own name, e.g. a per-axis control composed inside another form-associated component. */
  name?: string;
  /** CSS class on the host — e.g. for axis targeting ("lightness") or as a styling/selector hook. */
  className?: string;
  /** id for the wrapped <input>; also used as the `for` target of an optional `label`. */
  id?: string;
  /** Visible label text. When set, switches to the labeled layout (`<label>` + `div.input`/`div.buttons`) used for e.g. form-colorgraph's axes; omit for the compact layout (buttons flanking the input directly). */
  label?: string;
  /** id for the `<label>` itself, e.g. so another element can `aria-labelledby` it. */
  labelId?: string;
  /** Unit suffix shown next to the input (e.g. "%", "°"). Only rendered in the labeled layout. */
  unit?: string;
  /** `data-product` attribute — e.g. for module-catalog's per-item availability lookups. */
  dataProduct?: string;
  /** Initial value. */
  value: number;
  /** Lower bound (host `min` attribute). */
  min?: number;
  /** Upper bound (host `max` attribute). */
  max: number;
  /** Increment size (host `step` attribute). */
  step?: number;
  /** Shift-step increment size (host `big-step` attribute). */
  bigStep?: number;
  /** aria-label for the input; only used in the compact layout, where there's no visible `<label>`. */
  ariaLabel?: string;
  /** aria-label for the decrement button. */
  decrementLabel?: string;
  /** aria-label for the increment button. */
  incrementLabel?: string;
  /** Zero-state affordance text (e.g. "Add to Cart"). When set, hides the input/decrement button at `value === 0` and swaps the increment button's label; omit for a plain spinbutton with no zero-state UI. */
  zeroLabel?: string;
  /** id for the per-instance error `<p>`, e.g. "lightness-error". */
  errorId?: string;
};

// Exported so other components' stories can embed a spinbutton instance via
// ${FormSpinbutton(args)} instead of duplicating its markup — e.g.
// form-colorgraph.html.ts composes three (one per axis, labeled layout) and
// module-catalog.html.ts composes one per product (compact layout).
export const FormSpinbutton = ({
  name,
  className,
  id,
  label,
  labelId,
  unit,
  dataProduct,
  value,
  min = 0,
  max,
  step,
  bigStep,
  ariaLabel,
  decrementLabel = "Decrement",
  incrementLabel = "Increment",
  zeroLabel,
  errorId,
}: FormSpinbuttonArgs) => {
  const isZero = zeroLabel !== undefined && value === 0;
  const inputEl = html`
    <input
      type="number"
      class="value"
      id=${id || nothing}
      value=${value}
      step="any"
      aria-label=${label ? nothing : ariaLabel || nothing}
      ?hidden=${isZero}
    />
  `;
  const decrementButton = html`
    <button
      type="button"
      class="decrement"
      aria-label=${decrementLabel}
      ?hidden=${isZero}
    >
      −
    </button>
  `;
  const incrementButton = html`
    <button type="button" class="increment" aria-label=${incrementLabel}>
      ${
        zeroLabel !== undefined
          ? html`
              <span class="zero" ?hidden=${value !== 0}>${zeroLabel}</span>
              <span class="other" ?hidden=${value === 0}>+</span>
            `
          : "+"
      }
    </button>
  `;

  return html`
    <form-spinbutton
      class=${className || nothing}
      name=${name || nothing}
      data-product=${dataProduct || nothing}
      min=${min}
      max=${max}
      step=${step ?? nothing}
      big-step=${bigStep ?? nothing}
    >
      ${label ? html`<label id=${labelId || nothing} for=${id || nothing}>${label}</label>` : nothing}
      <fieldset>
        ${
          label
            ? html`
                <div class="input">
                  ${inputEl} ${unit ? html`<span class="unit">${unit}</span>` : nothing}
                </div>
                <div class="buttons">${decrementButton}${incrementButton}</div>
              `
            : html`${decrementButton}${inputEl}${incrementButton}`
        }
      </fieldset>
      <p class="error" role="alert" aria-live="assertive" id=${errorId || nothing}></p>
    </form-spinbutton>
  `;
};

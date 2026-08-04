import {
  bindProperty,
  bindText,
  defineComponent,
  defineMethod,
  type FormAssociatedElement,
  formAssociated,
} from "@zeix/le-truc";

export type AxisSpinbuttonProps = {
  /** Current value, in the units of the underlying native input (e.g. percent for lightness). */
  value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly bigStep: number;
  stepDown: (bigStep?: boolean) => void;
  stepUp: (bigStep?: boolean) => void;
};

declare global {
  interface HTMLElementTagNameMap {
    "axis-spinbutton": FormAssociatedElement & AxisSpinbuttonProps;
  }
}

const VALIDITY_KEYS = [
  "valueMissing",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "badInput",
] as const;

/**
 * A bounded floating-point spinbutton: a native number input plus
 * increment/decrement buttons and Arrow-key stepping, with its own
 * min/max/step range validity delegated from the native input via
 * ElementInternals. Unlike `form-spinbutton` (a cart-style quantity control
 * whose input and decrement button hide at zero), this is a plain continuous
 * field — built for composing into multi-axis controls like `form-colorgraph`,
 * where each axis needs its own native constraint validity (valueMissing /
 * rangeOverflow / rangeUnderflow), independent of any joint constraint the
 * parent layers on top via its own `host.setCustomValidity()`.
 **/
export default defineComponent<AxisSpinbuttonProps>(
  "axis-spinbutton",
  ({ expose, first, host, internals, on, watch }) => {
    const input = first(
      "input",
      "Add a native number input to display and edit the value.",
    );
    const decrement = first(
      "button.decrement",
      "Add a native button to decrement the value.",
    );
    const increment = first(
      "button.increment",
      "Add a native button to increment the value.",
    );

    // Range/step come from the markup (native input attributes), same as
    // the min/max/step a plain <input type="number"> would carry. Stepping
    // is grid-rounded in JS below, so the native input itself uses
    // step="any" — it never runs its own stepMismatch-triggering stepUp/
    // stepDown, only ours.
    const min = Number.parseFloat(input.min) || 0;
    const max = Number.parseFloat(input.max) || 100;
    const step = Number.parseFloat(input.step) || 1;
    const bigStep = Number.parseFloat(input.dataset.bigStep ?? "") || step * 10;
    input.step = "any";

    // Relay the native input's own constraint validity onto the host via
    // ElementInternals — native input's validationMessage isn't reactive,
    // so this must be re-run on every change, same as form-textbox/
    // form-combobox relay their inner control's validity to the host.
    const relayValidity = () => {
      input.checkValidity();
      const flags: Partial<Record<(typeof VALIDITY_KEYS)[number], boolean>> =
        {};
      for (const key of VALIDITY_KEYS) flags[key] = input.validity[key];
      internals?.setValidity(
        flags,
        input.validationMessage || undefined,
        input,
      );
    };

    const commit = (value: number) => {
      host.value = value;
      relayValidity();
      host.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const stepBy = (direction: 1 | -1, big = false) => {
      const delta = (big ? bigStep : step) * direction;
      const current = input.valueAsNumber || 0;
      const nearest = Math.round((current + delta) / step) * step;
      const clamped = Math.min(max, Math.max(min, nearest));
      input.value = String(clamped);
      commit(clamped);
    };

    expose({
      value: input.valueAsNumber || 0,
      min,
      max,
      step,
      bigStep,
      stepDown: defineMethod((big = false) => stepBy(-1, big)),
      stepUp: defineMethod((big = false) => stepBy(1, big)),
    });

    // Reflect the (possibly externally-set) value prop into the native
    // input's display. Also runs after our own commit(), which is a no-op
    // re-write since input.value is already at that number.
    watch(() => String(host.value), bindProperty(input, "value"));

    on(input, "change", () => {
      const next = input.valueAsNumber;
      commit(Number.isNaN(next) ? host.value : next);
    });
    on(decrement, "click", () => stepBy(-1, false));
    on(increment, "click", () => stepBy(1, false));
    on(host, "keydown", (event) => {
      const { key, shiftKey } = event as KeyboardEvent;
      if (!["ArrowUp", "ArrowDown", "+", "-"].includes(key)) return;
      event.preventDefault();
      event.stopPropagation();
      stepBy(key === "ArrowDown" || key === "-" ? -1 : 1, shiftKey);
    });

    watch(
      () => host.value <= min,
      (atMin) => {
        decrement.disabled = atMin;
      },
    );
    watch(
      () => host.value >= max,
      (atMax) => {
        increment.disabled = atMax;
      },
    );

    const errorEl = first(".error");
    if (errorEl) watch("validationMessage", bindText(errorEl));

    relayValidity();
  },
  [formAssociated()],
);

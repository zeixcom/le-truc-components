import {
  asClampedInteger,
  bindProperty,
  bindText,
  defineComponent,
} from "@zeix/le-truc";

export type ModulePaginationProps = {
  /** Highest selectable page number, initialized from the `<input>`'s `max` attribute. The host is hidden entirely (`hidden`) when this is `1` or less. */
  max: number;
  /** Current page number (1-based), initialized from the `<input>`'s value and clamped to `[1, max]`. */
  value: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "module-pagination": HTMLElement & ModulePaginationProps;
  }
}

/**
 * A page-number stepper with prev/next buttons and a number `<input>`, kept
 * in sync with clamping to `[1, max]`. Supports keyboard navigation (Arrow
 * Left/Right or `-`/`+` keys) anywhere in the host except while focus is in
 * the `<input>` itself, and moves focus off a prev/next button automatically
 * when it becomes disabled at the start/end of the range. The host must
 * contain a number `<input>`, a `button.prev`, and a `button.next`.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#module-pagination} Interactive preview and usage examples
 */
export default defineComponent<ModulePaginationProps>(
  "module-pagination",
  ({ expose, first, host, on, watch }) => {
    const input = first(
      "input",
      'Add an <input[type="number"]> to enter the page number to go to.',
    );
    const prev = first(
      "button.prev",
      "Add a <button.prev> to go to the previous page.",
    );
    const next = first(
      "button.next",
      "Add a <button.next> to go to the next page.",
    );

    expose({
      max: asClampedInteger(Number(input.max) ?? 1),
      value: asClampedInteger(input.valueAsNumber ?? 1, host.max),
    });

    on(host, "keyup", (e) => {
      const { key } = e;
      if (e.target instanceof HTMLInputElement) return;

      let nextPage = host.value;
      if ((key === "ArrowLeft" || key === "-") && host.value > 1) nextPage--;
      else if ((key === "ArrowRight" || key === "+") && host.value < host.max)
        nextPage++;
      if (document.activeElement === prev && nextPage <= 1) next.focus();
      else if (document.activeElement === next && nextPage >= host.max)
        prev.focus();
      host.value = nextPage;
    });
    on(input, "change", () => {
      const numValue = input.valueAsNumber;
      const clamped = Number.isNaN(numValue)
        ? 1
        : Math.max(1, Math.min(numValue, host.max));
      input.valueAsNumber = clamped;
      host.value = clamped;
    });
    on(prev, "click", () => {
      host.value--;
      if (host.value <= 1) next.focus();
    });
    on(next, "click", () => {
      host.value++;
      if (host.value >= host.max) prev.focus();
    });

    watch("value", (value) => {
      host.setAttribute("value", String(value));
      input.value = String(value);
      prev.disabled = value <= 1;
    });
    watch("max", (max) => {
      host.hidden = max <= 1;
      host.setAttribute("max", String(max));
      input.max = String(max);
    });
    watch(() => host.value >= host.max, bindProperty(next, "disabled"));
    const valueEl = first(".value");
    // preserveComments: Storybook's story interpolates this element's
    // content via a lit-html expression; the default (non-preserving) write
    // would eject Lit's ChildPart marker comments and break re-renders
    // driven by Controls.
    if (valueEl) watch("value", bindText(valueEl, true));
    const maxEl = first(".max");
    if (maxEl) watch("max", bindText(maxEl, true));
  },
  // Not observedAttributes(['value', 'max']): both props' watch() handlers
  // reflect back onto the same host attribute via setAttribute(), so
  // re-parsing that self-write on attributeChangedCallback would be a
  // circular update (le-truc throws "[Slot] Circular delegation detected").
);

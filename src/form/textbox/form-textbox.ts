import {
  bindProperty,
  bindText,
  bindVisible,
  createMemo,
  createState,
  defineComponent,
  defineMethod,
  type FormAssociatedElement,
  formAssociated,
} from "@zeix/le-truc";
import { relayValidity } from "../../_common/relayValidity";

export type FormTextboxProps = {
  /** Current text value. Synced with the native input or textarea. */
  value: string;
  /** Character length of the current value (read-only). */
  readonly length: number;
  /** Helper text shown below the input. May include a remaining-characters template. */
  description: string;
  /** Clears the input value and dispatches `input` and `change` events. */
  clear: () => void;
};

declare global {
  interface HTMLElementTagNameMap {
    "form-textbox": FormAssociatedElement & FormTextboxProps;
  }
}

/**
 * A single-line or multiline text input with validation, optional clear button, and helper text.
 * Use it when you need a styled text field — the underlying native input provides
 * keyboard accessibility and standard ARIA textbox semantics. Form participation
 * and validity are via ElementInternals (`formAssociated()`).
 * External consumers read `host.validationMessage` / `host.validity` like on a
 * native input; inline error display binds to component-internal state.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#form-textbox} Interactive preview and usage examples
 **/
export default defineComponent<FormTextboxProps>(
  "form-textbox",
  ({ expose, first, host, internals, on, watch }) => {
    const textbox = first(
      "input, textarea",
      "Add a native input or textarea as descendant element.",
    );
    const length = createState(textbox.value.length);

    // Reactive description: tracks remaining character count if template is present
    const descriptionEl = first(".description");
    const remainingTemplate = descriptionEl?.dataset.remaining;
    const descriptionMemo =
      descriptionEl && textbox.maxLength > 0 && remainingTemplate
        ? createMemo(() =>
            remainingTemplate.replace(
              // biome-ignore lint/suspicious/noTemplateCurlyInString: only look-alike
              "${n}",
              String(textbox.maxLength - host.length),
            ),
          )
        : null;

    expose({
      value: textbox.value,
      length: length.get,
      description: descriptionMemo ?? descriptionEl?.textContent?.trim() ?? "",
      clear: defineMethod(() => {
        host.value = "";
        textbox.value = "";
        textbox.setCustomValidity("");
        textbox.checkValidity();
        textbox.dispatchEvent(new Event("input", { bubbles: true }));
        textbox.dispatchEvent(new Event("change", { bubbles: true }));
        textbox.focus();
      }),
    });

    const error = createState("");
    on(textbox, "change", () => {
      relayValidity(textbox, host, error);
      return { value: textbox.value };
    });
    on(textbox, "input", () => {
      length.set(textbox.value.length);
    });
    watch("value", bindProperty(textbox, "value"));

    const clearBtn = first("button.clear");
    if (clearBtn) {
      internals?.states.add("clearable");
      on(clearBtn, "click", () => {
        host.clear();
      });
      watch(length, bindVisible(clearBtn));
    }

    if (descriptionEl) {
      const descriptionId = descriptionEl?.id;
      if (descriptionId)
        textbox.setAttribute("aria-describedby", descriptionId);
      // preserveComments: the Storybook story interpolates this element's
      // content via a lit-html expression; the default (non-preserving)
      // write would eject Lit's ChildPart marker comments and break
      // re-renders driven by Controls.
      watch("description", bindText(descriptionEl, true));
    }

    const errorEl = first(".error");
    if (errorEl) watch(error, bindText(errorEl));
  },
  [formAssociated()],
);

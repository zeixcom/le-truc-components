import {
  asBoolean,
  bindProperty,
  bindText,
  defineComponent,
  type FormAssociatedElement,
  formAssociatedCheckbox,
} from "@zeix/le-truc";

export type FormCheckboxProps = {
  /**
   * Whether the checkbox is checked. Read from the host's own `checked`
   * attribute at connect time — set it on `<form-checkbox>`, not the
   * inner native input — and restored to that default on `<form>.reset()`.
   */
  checked: boolean;
  /** Visible label text of the checkbox. */
  label: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "form-checkbox": FormAssociatedElement & FormCheckboxProps;
  }
}

export default defineComponent<FormCheckboxProps>(
  "form-checkbox",
  ({ expose, first, on, watch }) => {
    const label = first(".label") ?? first("label");

    expose({
      checked: asBoolean(),
      label: label?.textContent ?? "",
    });

    const checkbox = first('input[type="checkbox"]', "Add a native checkbox.");
    on(checkbox, "change", () => ({ checked: checkbox.checked }));
    watch("checked", bindProperty(checkbox, "checked"));
    watch("disabled", bindProperty(checkbox, "disabled"));

    if (label) watch("label", bindText(label));
  },
  [formAssociatedCheckbox()],
);

import { createMemo, defineComponent, type Memo } from "@zeix/le-truc";
import type { BasicButtonProps } from "../../basic/button/basic-button";
import type { FormSpinbuttonProps } from "../../form/spinbutton/form-spinbutton";

declare global {
  interface HTMLElementTagNameMap {
    "module-catalog": HTMLElement;
  }
}

export default defineComponent("module-catalog", ({ all, first, pass }) => {
  const spinbuttons = all(
    "form-spinbutton",
    "Add spinbutton components to calculate sum from.",
  ) as Memo<(HTMLElement & FormSpinbuttonProps)[]>;
  const total = createMemo(() =>
    spinbuttons.get().reduce((sum, item) => sum + item.value, 0),
  );

  const button = first(
    "basic-button",
    "Add a button to go to the Shopping Cart",
  ) as HTMLElement & BasicButtonProps;
  pass(button, {
    disabled: () => !total.get(),
    badge: () => (total.get() > 0 ? String(total.get()) : ""),
  });
});

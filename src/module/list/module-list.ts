import {
  createList,
  defineComponent,
  type List,
  reconcile,
} from "@zeix/le-truc";
import type { BasicButtonProps } from "../../basic/button/basic-button";
import type { FormTextboxProps } from "../../form/textbox/form-textbox";

declare global {
  interface HTMLElementTagNameMap {
    "module-list": HTMLElement;
  }
}

/**
 * A dynamic list component demonstrating the `createList()` keyed reconciliation API.
 * Items are added via a form submission and removed via delegated click handling,
 * with stable keys across reorders.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#module-list} Interactive preview and usage examples
 */
export default defineComponent("module-list", ({ first, host, on, pass }) => {
  // Keyed reactive list of plain string items. The 'item' prefix feeds the
  // auto-incrementing key generator (item0, item1, ...); keys are stable
  // across reorders, which is what lets removal target the right item.
  const list: List<string> = createList<string>([], { keyConfig: "item" });

  // Sync the container's children to the list: clones the template for
  // entering keys, removes leavers, moves survivors. bindItem fills the
  // cloned content — server-adopted items have no <slot> left, so the
  // fill is naturally idempotent.
  const container = first(
    "[data-container]",
    "Add a container element for items.",
  );
  const template = first("template", "Add a template element for items.");
  reconcile(container, template, list, (_element, item, _key, first) => {
    first("slot")?.replaceWith(document.createTextNode(item.get()));
  });

  // Add on submit, then clear the input by calling the child's method.
  const form = first("form", "Add a form element to enter a new list item.");
  const textbox = first(
    "form-textbox",
    "Add <form-textbox> component to enter a new list item.",
  ) as HTMLElement & FormTextboxProps;
  on(form, "submit", (event) => {
    event.preventDefault();
    const value = textbox.value.trim();
    if (!value) return;
    list.add(value);
    textbox.clear();
  });

  // Event delegation: one handler removes any item whose Remove button
  // was clicked, scaling to any number of items.
  on(host, "click", (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest("basic-button.remove")) return;
    const item = target.closest("[data-key]");
    if (!(item instanceof HTMLElement)) return;
    event.stopPropagation();
    const key = item.dataset.key;
    if (key) list.remove(key);
  });

  // Disable the submit button while the textbox is empty.
  const submit = first(
    "basic-button.submit",
    "Add <basic-button.submit> component to submit the form.",
  ) as HTMLElement & BasicButtonProps;
  pass(submit, { disabled: () => !textbox.length });
});

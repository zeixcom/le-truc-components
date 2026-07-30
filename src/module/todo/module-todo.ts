import {
  bindAttribute,
  createList,
  createMemo,
  createStore,
  defineComponent,
  each,
  reconcile,
  type Store,
} from "@zeix/le-truc";
import type { BasicButtonProps } from "../../basic/button/basic-button";
import type { BasicPluralizeProps } from "../../basic/pluralize/basic-pluralize";
import type { FormRadiogroupProps } from "../../form/radiogroup/form-radiogroup";
import type { FormTextboxProps } from "../../form/textbox/form-textbox";

export type TodoItem = {
  id: string;
  label: string;
  completed: boolean;
};

declare global {
  interface HTMLElementTagNameMap {
    "module-todo": HTMLElement;
  }
}

let idCounter = 0;

export default defineComponent(
  "module-todo",
  ({ all, first, host, on, pass, watch }) => {
    const container = first(
      "[data-container]",
      "Add a container element for items.",
    );
    const template = first("template", "Add a template element for items.");

    // Keyed reactive list of todo items; each item is its own Store, so
    // `completed` can be toggled per-item without touching the others.
    const list = createList<TodoItem, Store<TodoItem>>([], {
      keyConfig: (item) => item.id,
      createItem: createStore,
    });

    const completedCount = createMemo(
      () => list.get().filter((item) => item.completed).length,
    );
    const activeCount = createMemo(() => list.length - completedCount.get());

    const textbox = first(
      "form-textbox",
      "Add <form-textbox> component to enter a new todo item.",
    ) as HTMLElement & FormTextboxProps;
    const submit = first(
      "basic-button.submit",
      "Add <basic-button.submit> component to submit the form.",
    ) as HTMLElement & BasicButtonProps;
    pass(submit, { disabled: () => !textbox.length });

    const count = first(
      "basic-pluralize",
      "Add <basic-pluralize> component to display the number of todo items.",
    ) as HTMLElement & BasicPluralizeProps;
    pass(count, { count: () => activeCount.get() });

    const clearCompleted = first(
      "basic-button.clear-completed",
      "Add <basic-button.clear-completed> component to clear completed todo items.",
    ) as HTMLElement & BasicButtonProps;
    pass(clearCompleted, {
      disabled: () => !completedCount.get(),
      badge: () =>
        completedCount.get() ? String(completedCount.get()) : "",
    });
    on(clearCompleted, "click", () => {
      for (let i = list.length - 1; i >= 0; i--) {
        const key = list.keyAt(i);
        if (key && list.byKey(key)?.completed.get()) list.remove(key);
      }
    });

    // Mediate each rendered checkbox's `checked` prop to the matching item's
    // Store, so consumer clicks flow straight back into the reactive list.
    const checkboxComponents = all("form-checkbox");
    each(checkboxComponents, (checkbox) => {
      const key = checkbox.closest<HTMLElement>("[data-key]")?.dataset.key;
      if (!key || !checkbox.isConnected) return;
      pass(checkbox, {
        checked: {
          get: () => list.byKey(key)?.completed.get() ?? false,
          set: (checked: boolean) => list.byKey(key)?.completed.set(checked),
        },
      });
    });

    // Sync the container's children to the list. bindItem fills the cloned
    // content — server-adopted items already carry text, so the fill is
    // naturally idempotent (no <slot> left to replace).
    reconcile(container, template, list, (element, item) => {
      element
        .querySelector("slot")
        ?.replaceWith(document.createTextNode(item.label.get()));
    });

    const form = first(
      "form",
      "Add a form element to enter a new todo item.",
    );
    on(form, "submit", (e) => {
      e.preventDefault();
      const label = textbox.value.trim();
      if (!label) return;
      list.add({ id: `todo${++idCounter}`, label, completed: false });
      textbox.clear();
    });

    // Event delegation: one handler removes any item whose delete button
    // was clicked, scaling to any number of items.
    on(host, "click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest("basic-button.delete")) return;
      const item = target.closest("[data-key]");
      if (!(item instanceof HTMLElement)) return;
      e.stopPropagation();
      const key = item.dataset.key;
      if (key) list.remove(key);
    });

    const filter = first(
      "form-radiogroup",
      "Add <form-radiogroup> component to filter todo items.",
    ) as HTMLElement & FormRadiogroupProps;
    watch(() => filter.value || "all", bindAttribute(host, "filter"));
  },
);

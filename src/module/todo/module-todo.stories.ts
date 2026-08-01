import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, spyOn, userEvent, within } from "storybook/test";
import { Todo } from "./module-todo.html";
import "./module-todo.ts";
import "./module-todo.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../basic/pluralize/basic-pluralize.ts";
import "../../form/checkbox/form-checkbox.ts";
import "../../form/checkbox/form-checkbox.css";
import "../../form/inplace-edit/form-inplace-edit.ts";
import "../../form/inplace-edit/form-inplace-edit.css";
import "../../form/radiogroup/form-radiogroup.ts";
import "../../form/radiogroup/form-radiogroup.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";

const meta: Meta = {
  title: "Module/Todo",
  render: Todo,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AddAndComplete: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    await expect(addButton).toBeDisabled();

    await userEvent.type(input, "Buy groceries");
    await expect(addButton).not.toBeDisabled();

    await userEvent.click(addButton);

    await userEvent.type(input, "Walk the dog");
    await userEvent.click(addButton);

    const checkboxes = canvasElement.querySelectorAll(
      "form-checkbox input[type='checkbox']",
    );
    await expect(checkboxes.length).toBe(2);

    if (checkboxes[0]) {
      await userEvent.click(checkboxes[0]);

      const clearCompleted = canvas.getByRole("button", {
        name: /Clear Completed/,
      });
      await expect(clearCompleted).not.toBeDisabled();
    }
  },
};

export const WithFilter: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });
    // biome-ignore lint/style/noNonNullAssertion: rendered unconditionally by the story; if missing, the assertions below fail loudly.
    const todo = canvasElement.querySelector("module-todo")!;

    await userEvent.type(input, "Active task");
    await userEvent.click(addButton);

    await userEvent.type(input, "Completed task");
    await userEvent.click(addButton);

    const checkboxes = canvasElement.querySelectorAll(
      "form-checkbox input[type='checkbox']",
    );
    if (checkboxes[1]) {
      await userEvent.click(checkboxes[1]);

      await userEvent.click(canvas.getByRole("radio", { name: "Active" }));
      await expect(todo.matches(":state(filter-active)")).toBe(true);
      await expect(todo.matches(":state(filter-completed)")).toBe(false);

      await userEvent.click(canvas.getByRole("radio", { name: "Completed" }));
      await expect(todo.matches(":state(filter-completed)")).toBe(true);
      await expect(todo.matches(":state(filter-active)")).toBe(false);

      await userEvent.click(canvas.getByRole("radio", { name: "All" }));
      await expect(todo.matches(":state(filter-active)")).toBe(false);
      await expect(todo.matches(":state(filter-completed)")).toBe(false);
    }
  },
};

export const InlineEdit: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    await userEvent.type(input, "Bye groceries");
    await userEvent.click(addButton);

    const label = canvas.getByText("Bye groceries");
    await userEvent.dblClick(label);

    // biome-ignore lint/style/noNonNullAssertion: the dblClick above always opens the inline edit input; if missing, the assertions below fail loudly.
    const editInput = canvasElement.querySelector<HTMLInputElement>(
      "form-inplace-edit input",
    )!;
    await expect(editInput).toHaveValue("Bye groceries");

    await userEvent.clear(editInput);
    await userEvent.type(editInput, "Buy groceries{Enter}");

    await expect(canvas.getByText("Buy groceries")).toBeInTheDocument();
    await expect(
      canvasElement.querySelector("form-inplace-edit input"),
    ).not.toBeInTheDocument();
  },
};

export const RemoveItem: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    for (const label of ["Keep me", "Remove me"]) {
      await userEvent.type(input, label);
      await userEvent.click(addButton);
    }

    const items = canvasElement.querySelectorAll("[data-key]");
    await expect(items.length).toBe(2);

    const secondRemove = items[1]?.querySelector<HTMLButtonElement>(
      "basic-button.remove button",
    );
    if (!secondRemove) throw new Error("Missing remove button");
    await userEvent.click(secondRemove);

    const remaining = canvasElement.querySelectorAll("[data-key]");
    await expect(remaining.length).toBe(1);
    await expect(remaining[0]?.textContent).toContain("Keep me");
  },
};

export const ClearCompletedRemovesOnlyCompleted: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    for (const label of ["Active one", "Done one", "Done two"]) {
      await userEvent.type(input, label);
      await userEvent.click(addButton);
    }

    const checkboxes = canvasElement.querySelectorAll<HTMLInputElement>(
      "form-checkbox input[type='checkbox']",
    );
    await expect(checkboxes.length).toBe(3);
    if (checkboxes[1]) await userEvent.click(checkboxes[1]);
    if (checkboxes[2]) await userEvent.click(checkboxes[2]);

    const clearCompleted = canvas.getByRole("button", {
      name: /Clear Completed/,
    });
    await expect(clearCompleted).not.toBeDisabled();

    await userEvent.click(clearCompleted);

    const remaining = canvasElement.querySelectorAll("[data-key]");
    await expect(remaining.length).toBe(1);
    await expect(remaining[0]?.textContent).toContain("Active one");
    await expect(clearCompleted).toBeDisabled();
  },
};

export const EmptySubmitIsNoop: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    // Whitespace-only input has non-zero length (button enabled) but the
    // submit handler trims and bails, so no item is added.
    await userEvent.type(input, "   ");
    await expect(addButton).not.toBeDisabled();

    await userEvent.click(addButton);
    await expect(canvasElement.querySelectorAll("[data-key]").length).toBe(0);
  },
};

export const KeyboardEscapeAndBounds: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    for (const label of ["Top", "Bottom"]) {
      await userEvent.type(input, label);
      await userEvent.click(addButton);
    }

    const items = canvasElement.querySelectorAll("[data-key]");
    const topReorder =
      items[0]?.querySelector<HTMLButtonElement>("button.reorder");
    if (!topReorder) throw new Error("Missing reorder button");

    await userEvent.click(topReorder);
    // Already at the top — ArrowUp is a no-op (moveItem bails when newIdx < 0).
    await userEvent.keyboard("{ArrowUp}");
    await expect(
      canvasElement.querySelectorAll("[data-key]")[0]?.textContent,
    ).toContain("Top");

    // Escape deselects — subsequent arrow keys no longer move anything.
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{ArrowDown}");
    const order = canvasElement.querySelectorAll("[data-key]");
    await expect(order[0]?.textContent).toContain("Top");
    await expect(order[1]?.textContent).toContain("Bottom");
  },
};

export const DragReorder: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    for (const label of ["Alpha", "Beta", "Gamma"]) {
      await userEvent.type(input, label);
      await userEvent.click(addButton);
    }

    const todo = canvasElement.querySelector("module-todo") as HTMLElement;
    const items = () =>
      Array.from(canvasElement.querySelectorAll<HTMLElement>("[data-key]"));
    const firstHandle =
      items()[0]?.querySelector<HTMLButtonElement>("button.reorder");
    if (!firstHandle) throw new Error("Missing reorder button");
    const startRect = firstHandle.getBoundingClientRect();
    const lastRect = items()[2]?.getBoundingClientRect();
    if (!lastRect) throw new Error("Missing last item");

    // Real pointer capture requires an active hardware pointer, which a
    // synthetic PointerEvent doesn't provide — stub it out so the drag
    // handlers run without throwing.
    const captureSpy = spyOn(
      HTMLElement.prototype,
      "setPointerCapture",
    ).mockImplementation(() => {});

    firstHandle.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        clientX: startRect.left,
        clientY: startRect.top,
        bubbles: true,
      }),
    );

    todo.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: startRect.left,
        clientY: lastRect.bottom + 20,
        bubbles: true,
      }),
    );
    await expect(items()[0]).toHaveClass("dragging");
    await expect(canvasElement.querySelector(".drop-marker")).toBeTruthy();

    todo.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));

    const order = items();
    await expect(order[0]?.textContent).toContain("Beta");
    await expect(order[1]?.textContent).toContain("Gamma");
    await expect(order[2]?.textContent).toContain("Alpha");
    await expect(canvasElement.querySelector(".drop-marker")).toBeNull();
    await expect(order[2]).not.toHaveClass("dragging");

    captureSpy.mockRestore();
  },
};

export const DragCancelRestoresOrder: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    for (const label of ["One", "Two"]) {
      await userEvent.type(input, label);
      await userEvent.click(addButton);
    }

    const todo = canvasElement.querySelector("module-todo") as HTMLElement;
    const items = () =>
      Array.from(canvasElement.querySelectorAll<HTMLElement>("[data-key]"));
    const firstHandle =
      items()[0]?.querySelector<HTMLButtonElement>("button.reorder");
    if (!firstHandle) throw new Error("Missing reorder button");
    const startRect = firstHandle.getBoundingClientRect();

    const captureSpy = spyOn(
      HTMLElement.prototype,
      "setPointerCapture",
    ).mockImplementation(() => {});

    firstHandle.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        clientX: startRect.left,
        clientY: startRect.top,
        bubbles: true,
      }),
    );
    todo.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: startRect.left,
        clientY: startRect.top + 100,
        bubbles: true,
      }),
    );
    await expect(canvasElement.querySelector(".drop-marker")).toBeTruthy();

    todo.dispatchEvent(new PointerEvent("pointercancel", { pointerId: 1 }));

    await expect(canvasElement.querySelector(".drop-marker")).toBeNull();
    const order = items();
    await expect(order[0]?.textContent).toContain("One");
    await expect(order[1]?.textContent).toContain("Two");

    captureSpy.mockRestore();
  },
};

export const KeyboardReorder: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-todo");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("What needs to be done?");
    const addButton = canvas.getByRole("button", { name: "Add Todo" });

    for (const label of ["First", "Second", "Third"]) {
      await userEvent.type(input, label);
      await userEvent.click(addButton);
    }

    const items = canvasElement.querySelectorAll("[data-key]");
    await expect(items.length).toBe(3);
    await expect(items[0]?.textContent).toContain("First");

    const firstReorderButton =
      // biome-ignore lint/style/noNonNullAssertion: asserted above that 3 items exist, and each item always renders a reorder button.
      items[0]!.querySelector<HTMLButtonElement>("button.reorder")!;
    await userEvent.click(firstReorderButton);
    await userEvent.keyboard("{ArrowDown}");

    const reordered = canvasElement.querySelectorAll("[data-key]");
    await expect(reordered[0]?.textContent).toContain("Second");
    await expect(reordered[1]?.textContent).toContain("First");
  },
};

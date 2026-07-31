import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
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

const todoTemplate = html`
  <module-todo>
    <form action="#">
      <form-textbox>
        <label for="add-todo">What needs to be done?</label>
        <div class="input">
          <input id="add-todo" type="text" value="" />
          <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
        </div>
      </form-textbox>
      <basic-button class="submit">
        <button type="submit" class="constructive" disabled>
          <span class="label">Add Todo</span>
        </button>
      </basic-button>
    </form>
    <span role="status" class="visually-hidden"></span>
    <ol data-container></ol>
    <template>
      <li>
        <button type="button" class="reorder" aria-label="Drag to reorder" aria-pressed="false">
          ≡
        </button>
        <form-checkbox class="todo">
          <input type="checkbox" class="visually-hidden" />
          <form-inplace-edit>
            <label class="label text"><slot></slot></label>
            <button type="button" aria-label="Edit">✎</button>
          </form-inplace-edit>
        </form-checkbox>
        <basic-button class="remove">
          <button type="button" class="tertiary destructive small" aria-label="Remove">
            <span class="label">✕</span>
          </button>
        </basic-button>
      </li>
    </template>
    <footer>
      <basic-pluralize>
        <p class="none">Well done, all done!</p>
        <p class="some">
          <span class="count"></span>
          <span class="one"> task</span>
          <span class="other"> tasks</span>
          remaining
        </p>
      </basic-pluralize>
      <form-radiogroup value="all" class="split-button">
        <fieldset>
          <legend class="visually-hidden">Filter</legend>
          <label class="selected">
            <input type="radio" class="visually-hidden" name="filter" value="all" checked />
            <span>All</span>
          </label>
          <label>
            <input type="radio" class="visually-hidden" name="filter" value="active" />
            <span>Active</span>
          </label>
          <label>
            <input type="radio" class="visually-hidden" name="filter" value="completed" />
            <span>Completed</span>
          </label>
        </fieldset>
      </form-radiogroup>
      <basic-button class="clear-completed">
        <button type="button" class="tertiary destructive">
          <span class="label">Clear Completed</span>
          <span class="badge"></span>
        </button>
      </basic-button>
    </footer>
  </module-todo>
`;

const meta: Meta = {
  title: "Module/Todo",
  render: () => todoTemplate,
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

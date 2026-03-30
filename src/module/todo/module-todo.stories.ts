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
import "../../form/radiogroup/form-radiogroup.ts";
import "../../form/radiogroup/form-radiogroup.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";
import "../../module/list/module-list.ts";
import "../../module/list/module-list.css";

const todoTemplate = html`
  <module-todo>
    <form action="#">
      <form-textbox clearable>
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
    <module-list filter="all">
      <ol data-container></ol>
      <template>
        <li>
          <form-checkbox class="todo">
            <label>
              <input type="checkbox" class="visually-hidden" />
              <span class="label"><slot></slot></span>
            </label>
          </form-checkbox>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small" aria-label="Delete">
              <span class="label">✕</span>
            </button>
          </basic-button>
        </li>
      </template>
    </module-list>
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
      await userEvent.click(canvas.getByRole("radio", { name: "Completed" }));
      await userEvent.click(canvas.getByRole("radio", { name: "All" }));
    }
  },
};

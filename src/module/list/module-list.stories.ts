import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./module-list.ts";
import "./module-list.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";

const render = () => html`
  <module-list>
    <form action="#">
      <form-textbox clearable>
        <label for="new-item-input">New item</label>
        <div class="input">
          <input type="text" id="new-item-input" name="new-item" autocomplete="off" />
          <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
        </div>
      </form-textbox>
      <basic-button class="submit">
        <button type="submit" class="constructive" disabled>
          <span class="label">Add</span>
        </button>
      </basic-button>
    </form>
    <ul data-container></ul>
    <template>
      <li>
        <span><slot></slot></span>
        <basic-button class="remove">
          <button type="button" class="tertiary destructive small">Remove</button>
        </basic-button>
      </li>
    </template>
  </module-list>
`;

const meta: Meta = {
  title: "Module/List",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AddItem: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-list");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("New item");
    const addButton = canvas.getByRole("button", { name: "Add" });
    const container = canvasElement.querySelector("[data-container]");

    await expect(addButton).toBeDisabled();

    await userEvent.type(input, "Buy groceries");
    await expect(addButton).not.toBeDisabled();

    await userEvent.click(addButton);
    await expect(container?.children.length).toBe(1);

    await userEvent.type(input, "Walk the dog");
    await userEvent.click(addButton);
    await expect(container?.children.length).toBe(2);
  },
};

// ⚠️ Custom render: pre-populates the container with existing items to test that the component recognises server-rendered children
export const WithInitialItems: Story = {
  render: () => html`
    <module-list>
      <form action="#">
        <form-textbox clearable>
          <label for="initial-item-input">New item</label>
          <div class="input">
            <input type="text" id="initial-item-input" name="new-item" autocomplete="off" />
            <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
          </div>
        </form-textbox>
        <basic-button class="submit">
          <button type="submit" class="constructive" disabled>
            <span class="label">Add</span>
          </button>
        </basic-button>
      </form>
      <ul data-container>
        <li data-key="item0">
          <span>Existing item 1</span>
          <basic-button class="remove">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
        <li data-key="item1">
          <span>Existing item 2</span>
          <basic-button class="remove">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </ul>
      <template>
        <li>
          <span><slot></slot></span>
          <basic-button class="remove">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </template>
    </module-list>
  `,
};

export const RemoveItem: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-list");
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("New item");
    const addButton = canvas.getByRole("button", { name: "Add" });
    const container = canvasElement.querySelector("[data-container]");

    // Seed two items through the component's own API (form submit), not by
    // pre-rendering <li data-key>. reconcile() only keeps children whose keys
    // exist in the reactive list — which starts empty — so server-rendered
    // children are removed on mount. Seeding via the API is the only way to
    // populate the list (mirrors the AddItem story).
    await userEvent.type(input, "Buy groceries");
    await userEvent.click(addButton);
    await userEvent.type(input, "Walk the dog");
    await userEvent.click(addButton);
    await expect(container?.children.length).toBe(2);

    const removeButtons = canvasElement.querySelectorAll<HTMLButtonElement>(
      "basic-button.remove button",
    );
    await userEvent.click(removeButtons[0]!);
    await expect(container?.children.length).toBe(1);
  },
};

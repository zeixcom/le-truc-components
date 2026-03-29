import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./module-list.ts";
import "./module-list.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";

type ModuleListArgs = {
  max: number;
};

const meta: Meta<ModuleListArgs> = {
  title: "Module/List",
  argTypes: {
    max: {
      control: "number",
      table: {
        defaultValue: { summary: "1000" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleListArgs>;

export const Default: Story = {
  args: {
    max: 1000,
  },
  render: () => `
    <module-list>
      <ul data-container></ul>
      <template>
        <li>
          <span><slot></slot></span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </template>
      <form>
        <form-textbox clearable>
          <label for="new-item-input">New item</label>
          <div class="input">
            <input type="text" id="new-item-input" name="new-item" autocomplete="off" />
            <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
          </div>
        </form-textbox>
        <basic-button class="add">
          <button type="submit" class="constructive">Add</button>
        </basic-button>
      </form>
    </module-list>
  `,
};

export const AddItem: Story = {
  render: () => `
    <module-list>
      <ul data-container></ul>
      <template>
        <li>
          <span><slot></slot></span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </template>
      <form>
        <form-textbox clearable>
          <label for="add-item-input">New item</label>
          <div class="input">
            <input type="text" id="add-item-input" name="new-item" autocomplete="off" />
            <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
          </div>
        </form-textbox>
        <basic-button class="add">
          <button type="submit" class="constructive">Add</button>
        </basic-button>
      </form>
    </module-list>
  `,
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

export const WithInitialItems: Story = {
  render: () => `
    <module-list>
      <ul data-container>
        <li data-key="0">
          <span>Existing item 1</span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
        <li data-key="1">
          <span>Existing item 2</span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </ul>
      <template>
        <li>
          <span><slot></slot></span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </template>
      <form>
        <form-textbox clearable>
          <label for="initial-item-input">New item</label>
          <div class="input">
            <input type="text" id="initial-item-input" name="new-item" autocomplete="off" />
            <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
          </div>
        </form-textbox>
        <basic-button class="add">
          <button type="submit" class="constructive">Add</button>
        </basic-button>
      </form>
    </module-list>
  `,
};

export const WithMax: Story = {
  render: () => `
    <module-list max="3">
      <ul data-container>
        <li data-key="0">
          <span>Item 1</span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
        <li data-key="1">
          <span>Item 2</span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
        <li data-key="2">
          <span>Item 3</span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </ul>
      <template>
        <li>
          <span><slot></slot></span>
          <basic-button class="delete">
            <button type="button" class="tertiary destructive small">Remove</button>
          </basic-button>
        </li>
      </template>
      <form>
        <form-textbox clearable>
          <label for="max-item-input">New item</label>
          <div class="input">
            <input type="text" id="max-item-input" name="new-item" autocomplete="off" />
            <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
          </div>
        </form-textbox>
        <basic-button class="add">
          <button type="submit" class="constructive">Add</button>
        </basic-button>
      </form>
    </module-list>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-list");
    const canvas = within(canvasElement);
    const addButton = canvas.getByRole("button", { name: "Add" });

    await expect(addButton).toBeDisabled();
  },
};

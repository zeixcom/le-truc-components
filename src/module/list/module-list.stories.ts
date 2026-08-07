import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import { BasicButton } from "../../basic/button/basic-button.html";
import { FormTextbox } from "../../form/textbox/form-textbox.html";
import { ModuleList } from "./module-list.html";
import "./module-list.ts";
import "./module-list.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";

const meta: Meta = {
  title: "Module/List",
  render: ModuleList,
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
        ${FormTextbox({
          id: "initial-item-input",
          label: "New item",
          name: "new-item",
          autocomplete: "off",
          required: false,
          clearable: true,
          showError: false,
        })}
        ${BasicButton({
          label: "Add",
          disabled: true,
          variant: "constructive",
          type: "submit",
          hostClass: "submit",
        })}
      </form>
      <ul data-container>
        <li data-key="item0">
          <span>Existing item 1</span>
          ${BasicButton({
            label: "Remove",
            variant: ["tertiary", "destructive"],
            size: "small",
            content: "text",
            hostClass: "remove",
          })}
        </li>
        <li data-key="item1">
          <span>Existing item 2</span>
          ${BasicButton({
            label: "Remove",
            variant: ["tertiary", "destructive"],
            size: "small",
            content: "text",
            hostClass: "remove",
          })}
        </li>
      </ul>
      <!-- lit-html forbids expressions inside <template>, so this clone source stays static markup -->
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
    // biome-ignore lint/style/noNonNullAssertion: asserted above that 2 items exist, so a remove button is present.
    await userEvent.click(removeButtons[0]!);
    await expect(container?.children.length).toBe(1);
  },
};

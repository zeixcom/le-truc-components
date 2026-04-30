import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./form-inplace-edit.ts";
import "./form-inplace-edit.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";
import type { FormInplaceEditProps } from "./form-inplace-edit.ts";

type FormInplaceEditArgs = {
  value: string;
  editing: boolean;
};

const render = ({ value, editing }: FormInplaceEditArgs) => html`
  <form-inplace-edit ?editing=${editing}>
    <span class="text">${value}</span>
    <button type="button" aria-label="Edit">✎</button>
  </form-inplace-edit>
`;

const meta: Meta<FormInplaceEditArgs> = {
  title: "Form/Inplace Edit",
  render,
  argTypes: {
    value: {
      control: "text",
      table: {
        defaultValue: { summary: "Edit me" },
        category: "Reactive Properties",
      },
    },
    editing: {
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<FormInplaceEditArgs>;

export const Default: Story = {
  args: {
    value: "Edit me",
    editing: false,
  },
};

export const InitialEditing: Story = {
  args: {
    value: "Edit me",
    editing: true,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-inplace-edit");
    const el = canvasElement.querySelector(
      "form-inplace-edit",
    ) as HTMLElement & FormInplaceEditProps;
    await expect(el.editing).toBe(true);
    await expect(canvasElement.querySelector("form-textbox")).toBeInTheDocument();
  },
};

export const EditAndAccept: Story = {
  args: {
    value: "Edit me",
    editing: false,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-inplace-edit");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-inplace-edit",
    ) as HTMLElement & FormInplaceEditProps;

    await expect(el.editing).toBe(false);

    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    await expect(el.editing).toBe(true);
    await expect(canvasElement.querySelector("form-textbox")).toBeInTheDocument();

    const input = canvasElement.querySelector("input") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "Updated value");
    await userEvent.keyboard("{Enter}");

    await expect(el.editing).toBe(false);
    await expect(el.value).toBe("Updated value");
    await expect(canvasElement.querySelector(".text")).toHaveTextContent(
      "Updated value",
    );
  },
};

export const EditAndCancel: Story = {
  args: {
    value: "Edit me",
    editing: false,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-inplace-edit");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-inplace-edit",
    ) as HTMLElement & FormInplaceEditProps;

    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    await expect(el.editing).toBe(true);

    const input = canvasElement.querySelector("input") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "Will be discarded");
    await userEvent.keyboard("{Escape}");

    await expect(el.editing).toBe(false);
    await expect(el.value).toBe("Edit me");
    await expect(canvasElement.querySelector(".text")).toHaveTextContent(
      "Edit me",
    );
    await expect(
      canvasElement.querySelector("form-textbox"),
    ).not.toBeInTheDocument();
  },
};

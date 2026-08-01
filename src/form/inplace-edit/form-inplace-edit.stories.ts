import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import {
  type FormInplaceEditArgs,
  InplaceEdit,
} from "./form-inplace-edit.html";
import "./form-inplace-edit.ts";
import "./form-inplace-edit.css";
import "../textbox/form-textbox.ts";
import "../textbox/form-textbox.css";

const meta: Meta<FormInplaceEditArgs> = {
  title: "Form/Inplace Edit",
  render: InplaceEdit,
  argTypes: {
    name: {
      control: "text",
      description: "Form field name",
      table: { category: "Attributes" },
    },
    value: {
      control: "text",
      description: "Current text value — text content of .text at connect time",
      table: { category: "Reactive Properties" },
    },
  },
};
export default meta;
type Story = StoryObj<FormInplaceEditArgs>;

export const Default: Story = {
  args: {
    name: "label",
    value: "Edit me",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-inplace-edit");
    const canvas = within(canvasElement);
    const editBtn = canvas.getByRole("button", { name: "Edit" });

    await expect(canvas.getByText("Edit me")).toBeInTheDocument();

    // Click enters edit mode and focuses the generated input.
    await userEvent.click(editBtn);
    // biome-ignore lint/style/noNonNullAssertion: clicking Edit always renders the input; if it's missing the assertions below fail loudly.
    const input = canvasElement.querySelector("input")!;
    await expect(input).toHaveValue("Edit me");
    await expect(document.activeElement).toBe(input);

    // Enter accepts the change.
    await userEvent.type(input, " accepted{Enter}");
    await expect(canvas.getByText("Edit me accepted")).toBeInTheDocument();
    await expect(
      canvasElement.querySelector("form-textbox"),
    ).not.toBeInTheDocument();
  },
};

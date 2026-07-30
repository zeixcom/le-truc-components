import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./form-inplace-edit.ts";
import "./form-inplace-edit.css";
import "../textbox/form-textbox.ts";
import "../textbox/form-textbox.css";

const render = () => html`
  <form-inplace-edit name="label">
    <span class="text">Edit me</span>
    <button type="button" aria-label="Edit">✎</button>
  </form-inplace-edit>
`;

const meta: Meta = {
  title: "Form/Inplace Edit",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-inplace-edit");
    const canvas = within(canvasElement);
    const editBtn = canvas.getByRole("button", { name: "Edit" });

    await expect(canvas.getByText("Edit me")).toBeInTheDocument();

    // Click enters edit mode and focuses the generated input.
    await userEvent.click(editBtn);
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

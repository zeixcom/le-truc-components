import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./form-inplace-edit.ts";
import "./form-inplace-edit.css";
import "../textbox/form-textbox.ts";
import "../textbox/form-textbox.css";

type FormInplaceEditArgs = {
  name: string;
  value: string;
};

// Exported so other components' stories can embed an inplace-edit instance
// via ${InplaceEdit(args)} instead of duplicating its markup.
export const InplaceEdit = ({ name, value }: FormInplaceEditArgs) => html`
  <form-inplace-edit name=${name}>
    <span class="text">${value}</span>
    <button type="button" aria-label="Edit">✎</button>
  </form-inplace-edit>
`;

const meta: Meta<FormInplaceEditArgs> = {
  title: "Form/Inplace Edit",
  render: InplaceEdit,
  // InplaceEdit is exported for reuse by other stories files, not a story itself.
  excludeStories: /^InplaceEdit$/,
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

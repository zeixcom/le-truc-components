import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./form-checkbox.ts";
import "./form-checkbox.css";
import type { FormAssociatedElement } from "@zeix/le-truc";
import type { FormCheckboxProps } from "./form-checkbox.ts";

type FormCheckboxArgs = {
  checked: boolean;
  label: string;
  variant: "none" | "checkbox" | "todo" | "toggle";
};

const render = ({ checked, label, variant }: FormCheckboxArgs) => html`
  <form-checkbox class=${variant !== "none" ? variant : nothing} ?checked=${checked}>
    <label>
      <input
        type="checkbox"
        class=${variant !== "none" ? "visually-hidden" : nothing}
        ?checked=${checked}
      />
      <span class="label">${label}</span>
    </label>
  </form-checkbox>
`;

const meta: Meta<FormCheckboxArgs> = {
  title: "Form/Checkbox",
  render,
  argTypes: {
    checked: {
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "Reactive Properties",
      },
    },
    label: {
      control: "text",
      table: { category: "Reactive Properties" },
    },
    variant: {
      control: { type: "select" },
      options: ["none", "checkbox", "todo", "toggle"],
      table: { category: "Classes" },
    },
  },
};
export default meta;
type Story = StoryObj<FormCheckboxArgs>;

export const Default: Story = {
  args: {
    checked: false,
    label: "Checkbox",
    variant: "checkbox",
  },
};

const allVariants: FormCheckboxArgs[] = [
  { checked: false, label: "Default (native)", variant: "none" },
  { checked: false, label: "Checkbox", variant: "checkbox" },
  { checked: false, label: "Todo item", variant: "todo" },
  { checked: false, label: "Toggle switch", variant: "toggle" },
];

export const AllVariants: Story = {
  render: () =>
    html`${allVariants.map((args, i) => html`${render(args)}${i < allVariants.length - 1 ? html`<br />` : nothing}`)}`,
};

export const InitialChecked: Story = {
  args: {
    checked: true,
    label: "Initially checked",
    variant: "checkbox",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-checkbox");
    const el = canvasElement.querySelector("form-checkbox") as HTMLElement &
      FormAssociatedElement &
      FormCheckboxProps;

    await expect(el.checked).toBe(true);
    await expect(el).toHaveAttribute("checked");
  },
};

export const DynamicUpdates: Story = {
  args: {
    checked: false,
    label: "Click me",
    variant: "checkbox",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-checkbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-checkbox") as HTMLElement &
      FormAssociatedElement &
      FormCheckboxProps;

    await expect(el.checked).toBe(false);
    await expect(el).not.toHaveAttribute("checked");

    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(el.checked).toBe(true);
    // `checked` attribute is the reset default (defaultChecked semantics),
    // not a live reflection — the checked visual state is driven by the
    // native input via `:has(input:checked)` in CSS.
    await expect(canvas.getByRole("checkbox")).toBeChecked();

    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(el.checked).toBe(false);
  },
};

export const PropertyChanges: Story = {
  args: {
    checked: false,
    label: "Task label",
    variant: "todo",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-checkbox");
    const el = canvasElement.querySelector("form-checkbox") as HTMLElement &
      FormAssociatedElement &
      FormCheckboxProps;
    const checkbox = el.querySelector("input");
    const labelEl = el.querySelector(".label");

    el.checked = true;
    await expect(checkbox?.checked).toBe(true);

    el.label = "Updated label";
    await expect(labelEl).toHaveTextContent("Updated label");
  },
};

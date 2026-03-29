import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./form-checkbox.ts";
import "./form-checkbox.css";
import type { Component } from "@zeix/le-truc";
import type { FormCheckboxProps } from "./form-checkbox.ts";

type FormCheckboxArgs = {
  checked: boolean;
  label: string;
  variant: "none" | "checkbox" | "todo" | "toggle";
};

const meta: Meta<FormCheckboxArgs> = {
  title: "Form/Checkbox",
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
  render: ({ checked, label, variant }) => {
    const cls = variant !== "none" ? ` class="${variant}"` : "";
    return `
      <form-checkbox${cls}>
        <label>
          <input type="checkbox" class="visually-hidden"${checked ? " checked" : ""} />
          <span class="label">${label}</span>
        </label>
      </form-checkbox>
    `;
  },
};

export const AllVariants: Story = {
  render: () => `
    <form-checkbox>
      <label>
        <input type="checkbox" />
        <span class="label">Default (native)</span>
      </label>
    </form-checkbox>
    <br />
    <form-checkbox class="checkbox">
      <label>
        <input type="checkbox" class="visually-hidden" />
        <span class="label">Checkbox</span>
      </label>
    </form-checkbox>
    <br />
    <form-checkbox class="todo">
      <label>
        <input type="checkbox" class="visually-hidden" />
        <span class="label">Todo item</span>
      </label>
    </form-checkbox>
    <br />
    <form-checkbox class="toggle">
      <label>
        <input type="checkbox" class="visually-hidden" />
        <span class="label">Toggle switch</span>
      </label>
    </form-checkbox>
  `,
};

export const InitialChecked: Story = {
  render: () => `
    <form-checkbox class="checkbox">
      <label>
        <input type="checkbox" class="visually-hidden" checked />
        <span class="label">Initially checked</span>
      </label>
    </form-checkbox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-checkbox");
    const el = canvasElement.querySelector(
      "form-checkbox",
    ) as Component<FormCheckboxProps>;

    await expect(el.checked).toBe(true);
    await expect(el).toHaveAttribute("checked");
  },
};

export const DynamicUpdates: Story = {
  render: () => `
    <form-checkbox class="checkbox">
      <label>
        <input type="checkbox" class="visually-hidden" />
        <span class="label">Click me</span>
      </label>
    </form-checkbox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-checkbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-checkbox",
    ) as Component<FormCheckboxProps>;

    await expect(el.checked).toBe(false);
    await expect(el).not.toHaveAttribute("checked");

    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(el.checked).toBe(true);
    await expect(el).toHaveAttribute("checked");

    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(el.checked).toBe(false);
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <form-checkbox class="todo">
      <label>
        <input type="checkbox" class="visually-hidden" />
        <span class="label">Task label</span>
      </label>
    </form-checkbox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-checkbox");
    const el = canvasElement.querySelector(
      "form-checkbox",
    ) as Component<FormCheckboxProps>;
    const checkbox = el.querySelector("input");
    const labelEl = el.querySelector(".label");

    el.checked = true;
    await expect(checkbox?.checked).toBe(true);

    el.label = "Updated label";
    await expect(labelEl).toHaveTextContent("Updated label");
  },
};

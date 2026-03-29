import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./form-spinbutton.ts";
import "./form-spinbutton.css";
import type { Component } from "@zeix/le-truc";
import type { FormSpinbuttonProps } from "./form-spinbutton.ts";

type FormSpinbuttonArgs = {
  value: number;
  max: number;
};

const meta: Meta<FormSpinbuttonArgs> = {
  title: "Form/Spinbutton",
  argTypes: {
    value: {
      control: "number",
      table: {
        defaultValue: { summary: "parsed from input.value (0 if missing)" },
        category: "Reactive Properties",
      },
    },
    max: {
      control: "number",
      table: {
        defaultValue: { summary: "10" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<FormSpinbuttonArgs>;

export const Default: Story = {
  args: {
    value: 0,
    max: 10,
  },
  render: ({ value, max }) => `
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement"${value === 0 ? " hidden" : ""}>−</button>
      <input
        type="number"
        class="value"
        name="amount"
        value="${value}"
        min="0"
        max="${max}"
        readonly
        disabled
        ${value === 0 ? "hidden" : ""}
      />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero"${value !== 0 ? " hidden" : ""}>Add to Cart</span>
        <span class="other"${value === 0 ? " hidden" : ""}>+</span>
      </button>
    </form-spinbutton>
  `,
};

export const WithInitialValue: Story = {
  render: () => `
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement">−</button>
      <input
        type="number"
        class="value"
        name="amount"
        value="3"
        min="0"
        max="15"
        readonly
        disabled
      />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero" hidden>Add</span>
        <span class="other">+</span>
      </button>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector(
      "form-spinbutton",
    ) as Component<FormSpinbuttonProps>;

    await expect(el.value).toBe(3);
    await expect(el.max).toBe(15);
  },
};

export const IncrementDecrement: Story = {
  render: () => `
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement" hidden>−</button>
      <input
        type="number"
        class="value"
        name="qty"
        value="0"
        min="0"
        max="5"
        readonly
        disabled
        hidden
      />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero">Add</span>
        <span class="other" hidden>+</span>
      </button>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-spinbutton",
    ) as Component<FormSpinbuttonProps>;
    const increment = canvas.getByLabelText("Increment");

    await expect(el.value).toBe(0);

    await userEvent.click(increment);
    await expect(el.value).toBe(1);

    await userEvent.click(increment);
    await userEvent.click(increment);
    await expect(el.value).toBe(3);

    const decrement = canvas.getByLabelText("Decrement");
    await userEvent.click(decrement);
    await expect(el.value).toBe(2);
  },
};

export const ClampedAtMax: Story = {
  render: () => `
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement">−</button>
      <input type="number" class="value" name="qty" value="4" min="0" max="5" readonly disabled />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero" hidden>Add</span>
        <span class="other">+</span>
      </button>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-spinbutton",
    ) as Component<FormSpinbuttonProps>;
    const increment = canvas.getByLabelText("Increment");

    await expect(el.value).toBe(4);

    await userEvent.click(increment);
    await expect(el.value).toBe(5);
    await expect(increment).toBeDisabled();
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement" hidden>−</button>
      <input type="number" class="value" name="qty" value="0" min="0" max="10" readonly disabled hidden />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero">Add</span>
        <span class="other" hidden>+</span>
      </button>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector(
      "form-spinbutton",
    ) as Component<FormSpinbuttonProps>;
    const input = el.querySelector("input.value");

    el.value = 7;
    await expect(input).toHaveValue(7);

    el.value = 0;
    await expect(input).not.toBeVisible();
  },
};

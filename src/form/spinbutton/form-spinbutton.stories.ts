import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./form-spinbutton.ts";
import "./form-spinbutton.css";
import type { FormSpinbuttonProps } from "./form-spinbutton.ts";

type FormSpinbuttonArgs = {
  value: number;
  max: number;
};

const render = ({ value, max }: FormSpinbuttonArgs) => html`
  <form-spinbutton>
    <button
      type="button"
      class="decrement"
      aria-label="Decrement"
      ?hidden=${value === 0}
    >
      −
    </button>
    <input
      type="number"
      class="value"
      name="amount"
      value=${value}
      min="0"
      max=${max}
      readonly
      disabled
      ?hidden=${value === 0}
    />
    <button type="button" class="increment" aria-label="Increment">
      <span class="zero" ?hidden=${value !== 0}>Add to Cart</span>
      <span class="other" ?hidden=${value === 0}>+</span>
    </button>
  </form-spinbutton>
`;

const meta: Meta<FormSpinbuttonArgs> = {
  title: "Form/Spinbutton",
  render,
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
};

export const WithInitialValue: Story = {
  args: { value: 3, max: 15 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormSpinbuttonProps;

    await expect(el.value).toBe(3);
    await expect(el.max).toBe(15);
  },
};

export const IncrementDecrement: Story = {
  args: { value: 0, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormSpinbuttonProps;
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
  args: { value: 4, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormSpinbuttonProps;
    const increment = canvas.getByLabelText("Increment");

    await expect(el.value).toBe(4);

    await userEvent.click(increment);
    await expect(el.value).toBe(5);
    await expect(increment).toBeDisabled();
  },
};

export const PropertyChanges: Story = {
  args: { value: 0, max: 10 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormSpinbuttonProps;
    const input = el.querySelector("input.value");

    el.value = 7;
    await expect(input).toHaveValue(7);

    el.value = 0;
    await expect(input).not.toBeVisible();
  },
};

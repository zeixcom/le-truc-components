import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { type FormSpinbuttonArgs, Spinbutton } from "./form-spinbutton.html";
import "./form-spinbutton.ts";
import "./form-spinbutton.css";
import type { FormAssociatedElement } from "@zeix/le-truc";
import type { FormSpinbuttonProps } from "./form-spinbutton.ts";

const meta: Meta<FormSpinbuttonArgs> = {
  title: "Form/Spinbutton",
  render: Spinbutton,
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
      FormAssociatedElement &
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
      FormAssociatedElement &
      FormSpinbuttonProps;

    await expect(el.value).toBe(0);

    // At value 0 the increment button reads "Add to Cart" (its `.zero` label),
    // not "Increment" — the spinbutton re-labels it while the value is zero.
    const addToCart = canvas.getByLabelText("Add to Cart");
    await userEvent.click(addToCart);
    await expect(el.value).toBe(1);

    // Once value > 0 the label reverts to "Increment" and Decrement appears.
    const increment = canvas.getByLabelText("Increment");
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
      FormAssociatedElement &
      FormSpinbuttonProps;
    const increment = canvas.getByLabelText("Increment");

    await expect(el.value).toBe(4);

    await userEvent.click(increment);
    await expect(el.value).toBe(5);
    await expect(increment).toBeDisabled();
  },
};

export const KeyboardControl: Story = {
  args: { value: 3, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const increment = canvas.getByLabelText("Increment");
    const decrement = canvas.getByLabelText("Decrement");

    increment.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(el.value).toBe(4);

    await userEvent.keyboard("+");
    await expect(el.value).toBe(5);
    await expect(increment).toBeDisabled();

    // Already at max — further increment stays clamped.
    await userEvent.keyboard("{ArrowUp}");
    await expect(el.value).toBe(5);

    decrement.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(el.value).toBe(4);

    await userEvent.keyboard("-");
    await expect(el.value).toBe(3);

    // Unrelated key: no change.
    await userEvent.keyboard("a");
    await expect(el.value).toBe(3);
  },
};

export const Validity: Story = {
  args: { value: 3, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;

    await expect(el.validity.valid).toBe(true);

    el.value = 8;
    await expect(el.validity.rangeOverflow).toBe(true);
    await expect(el.validationMessage).toBe("Value must be 5 or less");

    el.value = -2;
    await expect(el.validity.rangeUnderflow).toBe(true);
    await expect(el.validationMessage).toBe("Value must be 0 or greater");

    el.value = 3;
    await expect(el.validity.valid).toBe(true);
  },
};

export const PropertyChanges: Story = {
  args: { value: 0, max: 10 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const input = el.querySelector("input.value");

    el.value = 7;
    await expect(input).toHaveValue(7);

    el.value = 0;
    await expect(input).not.toBeVisible();
  },
};

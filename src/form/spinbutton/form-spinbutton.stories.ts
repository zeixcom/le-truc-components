import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, fireEvent, userEvent, within } from "storybook/test";
import {
  FormSpinbutton,
  type FormSpinbuttonArgs,
} from "./form-spinbutton.html";
import "./form-spinbutton.ts";
import "./form-spinbutton.css";
import type { FormAssociatedElement } from "@zeix/le-truc";
import type { FormSpinbuttonProps } from "./form-spinbutton.ts";

const meta: Meta<FormSpinbuttonArgs> = {
  title: "Form/Spinbutton",
  render: FormSpinbutton,
  args: {
    name: "amount",
    ariaLabel: "Quantity",
    zeroLabel: "Add to Cart",
  },
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
    await expect(el.validationMessage).not.toBe("");

    el.value = -2;
    await expect(el.validity.rangeUnderflow).toBe(true);
    await expect(el.validationMessage).not.toBe("");

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

export const DecrementAtZero: Story = {
  args: { value: 0, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;

    // At value 0 the decrement button is hidden, but the shared keydown
    // handler on `controls` still clamps at the lower bound — exercise it
    // via the (always-visible) increment button.
    const addToCart = canvas.getByLabelText("Add to Cart");
    addToCart.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(el.value).toBe(0);
    await userEvent.keyboard("-");
    await expect(el.value).toBe(0);
  },
};

export const MaxChangesPostConnect: Story = {
  args: { value: 5, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const input = el.querySelector("input.value") as HTMLInputElement;
    const increment = el.querySelector("button.increment") as HTMLElement;

    await expect(el.value).toBe(5);
    await expect(input).toHaveAttribute("max", "5");
    await expect(increment).toBeDisabled();
    await expect(el.validity.rangeOverflow).toBe(false);

    el.max = 10;
    await expect(input).toHaveAttribute("max", "10");
    await expect(increment).not.toBeDisabled();

    // Existing value is untouched by a widening max — no auto re-clamp.
    await expect(el.value).toBe(5);

    // A narrowing max below the current value trips rangeOverflow, mirroring
    // Validity's direct-value-assignment check but from the max side.
    el.max = 3;
    await expect(el.validity.rangeOverflow).toBe(true);
    await expect(el.validationMessage).not.toBe("");
  },
};

export const NegativeMin: Story = {
  render: () => html`
    <form-spinbutton name="temperature">
      <label for="temperature-input">Temperature</label>
      <fieldset>
        <div class="input">
          <input id="temperature-input" type="number" min="-10" max="10" value="0" />
          °C
        </div>
        <div class="buttons">
          <button type="button" class="decrement" aria-label="Decrement">−</button>
          <button type="button" class="increment" aria-label="Increment">+</button>
        </div>
      </fieldset>
      <p class="error" role="alert" aria-live="assertive"></p>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const decrement = canvas.getByLabelText("Decrement");

    await expect(el.min).toBe(-10);
    await userEvent.click(decrement);
    await expect(el.value).toBe(-1);

    // Typing "-" directly into the focused input is left to the browser,
    // not intercepted as a decrement shortcut.
    const input = canvasElement.querySelector("input") as HTMLInputElement;
    input.focus();
    await userEvent.keyboard("-");
    await expect(el.value).toBe(-1);
  },
};

export const FractionalStep: Story = {
  render: () => html`
    <form-spinbutton name="weight" step="0.5">
      <label for="weight-input">Weight</label>
      <fieldset>
        <div class="input">
          <input id="weight-input" type="number" min="0" max="5" step="0.5" value="0" />
          kg
        </div>
        <div class="buttons">
          <button type="button" class="decrement" aria-label="Decrement">−</button>
          <button type="button" class="increment" aria-label="Increment">+</button>
        </div>
      </fieldset>
      <p class="error" role="alert" aria-live="assertive"></p>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const increment = canvas.getByLabelText("Increment");

    await userEvent.click(increment);
    await expect(el.value).toBe(0.5);
    await userEvent.click(increment);
    await expect(el.value).toBe(1);
  },
};

export const CustomBigStep: Story = {
  render: () => html`
    <form-spinbutton name="points" big-step="5">
      <label for="points-input">Points</label>
      <fieldset>
        <div class="input">
          <input id="points-input" type="number" min="0" max="100" value="0" />
        </div>
        <div class="buttons">
          <button type="button" class="decrement" aria-label="Decrement">−</button>
          <button type="button" class="increment" aria-label="Increment">+</button>
        </div>
      </fieldset>
      <p class="error" role="alert" aria-live="assertive"></p>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const increment = canvas.getByLabelText("Increment");

    increment.focus();
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect(el.value).toBe(5);

    // Shift+click steps by big-step too, not just Shift+Arrow.
    await fireEvent.click(increment, { shiftKey: true });
    await expect(el.value).toBe(10);

    const decrement = canvas.getByLabelText("Decrement");
    await fireEvent.click(decrement, { shiftKey: true });
    await expect(el.value).toBe(5);
  },
};

export const DisabledCascadesToFieldset: Story = {
  args: { value: 3, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const fieldset = el.querySelector("fieldset") as HTMLFieldSetElement;
    const increment = el.querySelector("button.increment") as HTMLButtonElement;

    el.disabled = true;
    await expect(fieldset.disabled).toBe(true);
    // The `disabled` IDL attribute only reflects a control's own content
    // attribute, not fieldset-inherited disabling — `:disabled` is what
    // actually reflects the cascaded, effective disabled state.
    await expect(increment.matches(":disabled")).toBe(true);

    el.disabled = false;
    await expect(fieldset.disabled).toBe(false);
  },
};

// ⚠️ Custom render: the default markup's input is readonly + disabled (value
// only changes via buttons/keyboard). This story uses an editable input to
// exercise the on(controls, 'change') native-change-event path.
export const DirectInputChange: Story = {
  render: () => html`
    <form-spinbutton name="amount">
      <fieldset>
        <button type="button" class="decrement" aria-label="Decrement">−</button>
        <input
          type="number"
          class="value"
          value="3"
          min="0"
          max="5"
          aria-label="Quantity"
        />
        <button type="button" class="increment" aria-label="Increment">
          <span class="other">+</span>
        </button>
      </fieldset>
    </form-spinbutton>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-spinbutton") as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const input = canvas.getByLabelText("Quantity") as HTMLInputElement;

    await expect(el.value).toBe(3);

    // Typing a value in range and firing a native change commits it.
    await userEvent.clear(input);
    await userEvent.type(input, "4");
    await fireEvent.change(input);
    await expect(el.value).toBe(4);

    // Out-of-range: change event clamps both the input and host.value.
    await userEvent.clear(input);
    await userEvent.type(input, "9");
    await fireEvent.change(input);
    await expect(el.value).toBe(5);
    await expect(input).toHaveValue(5);

    // Non-integer input reverts the input's displayed value to host.value,
    // without changing host.value itself.
    input.value = "2.5";
    await fireEvent.change(input);
    await expect(el.value).toBe(5);
    await expect(input).toHaveValue(5);
  },
};

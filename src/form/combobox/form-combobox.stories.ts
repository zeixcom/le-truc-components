import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "../listbox/form-listbox.ts";
import "../listbox/form-listbox.css";
import "../../card/callout/card-callout.css";
import "../../module/scrollarea/module-scrollarea.ts";
import "../../module/scrollarea/module-scrollarea.css";
import "./form-combobox.ts";
import "./form-combobox.css";
import type { Component } from "@zeix/le-truc";
import type { FormComboboxProps } from "./form-combobox.ts";

type FormComboboxArgs = {
  error: string;
  description: string;
};

const render = ({ error, description }: FormComboboxArgs) => html`
  <form-combobox>
    <label for="color-input" id="color-label">Favourite color</label>
    <div class="input">
      <input
        id="color-input"
        type="text"
        name="color"
        role="combobox"
        aria-expanded="false"
        aria-controls="color-popup"
        aria-autocomplete="list"
        autocomplete="off"
      />
      <form-listbox id="color-popup">
        <input type="hidden" name="color-listbox" />
        <div role="listbox" aria-labelledby="color-label">
          <button type="button" role="option" tabindex="-1" value="red">Red</button>
          <button type="button" role="option" tabindex="-1" value="green">Green</button>
          <button type="button" role="option" tabindex="-1" value="blue">Blue</button>
          <button type="button" role="option" tabindex="-1" value="yellow">Yellow</button>
          <button type="button" role="option" tabindex="-1" value="purple">Purple</button>
        </div>
      </form-listbox>
    </div>
    <p class="error" role="alert" aria-live="assertive" id="color-error">${error}</p>
    <p class="description" aria-live="polite" id="color-description">${description}</p>
  </form-combobox>
`;

const meta: Meta<FormComboboxArgs> = {
  title: "Form/Combobox",
  render,
  argTypes: {
    error: {
      control: "text",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
    description: {
      control: "text",
      table: {
        defaultValue: { summary: "text content of .description" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<FormComboboxArgs>;

export const Default: Story = {
  args: {
    error: "",
    description: "Choose your favourite color.",
  },
};

// ⚠️ Custom render: uses a different field (fruit) with clearable attribute and a clear button in the input wrapper
export const WithClear: Story = {
  render: () => html`
    <form-combobox clearable>
      <label for="fruit-input" id="fruit-label">Favourite fruit</label>
      <div class="input">
        <input
          id="fruit-input"
          type="text"
          name="fruit"
          role="combobox"
          aria-expanded="false"
          aria-controls="fruit-popup"
          aria-autocomplete="list"
          autocomplete="off"
        />
        <form-listbox id="fruit-popup">
          <input type="hidden" name="fruit-listbox" />
          <div role="listbox" aria-labelledby="fruit-label">
            <button type="button" role="option" tabindex="-1" value="apple">Apple</button>
            <button type="button" role="option" tabindex="-1" value="banana">Banana</button>
            <button type="button" role="option" tabindex="-1" value="cherry">Cherry</button>
            <button type="button" role="option" tabindex="-1" value="mango">Mango</button>
          </div>
        </form-listbox>
        <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
      </div>
    </form-combobox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-combobox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-combobox",
    ) as Component<FormComboboxProps>;
    const input = canvas.getByRole("combobox");

    await expect(el.value).toBe("");

    await userEvent.type(input, "ban");
    await expect(el.value).toBe("ban");

    el.clear();
    await expect(el.value).toBe("");
    await expect(input).toHaveValue("");
  },
};

// ⚠️ Custom render: uses a different field (language) with required validation and no description paragraph
export const WithValidation: Story = {
  render: () => html`
    <form-combobox>
      <label for="lang-input" id="lang-label">Language</label>
      <div class="input">
        <input
          id="lang-input"
          type="text"
          name="language"
          role="combobox"
          aria-expanded="false"
          aria-controls="lang-popup"
          aria-autocomplete="list"
          autocomplete="off"
          required
        />
        <form-listbox id="lang-popup">
          <input type="hidden" name="language-listbox" />
          <div role="listbox" aria-labelledby="lang-label">
            <button type="button" role="option" tabindex="-1" value="en">English</button>
            <button type="button" role="option" tabindex="-1" value="fr">French</button>
            <button type="button" role="option" tabindex="-1" value="de">German</button>
          </div>
        </form-listbox>
      </div>
      <p class="error" role="alert" aria-live="assertive" id="lang-error"></p>
    </form-combobox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-combobox");
    const el = canvasElement.querySelector(
      "form-combobox",
    ) as Component<FormComboboxProps>;

    el.error = "Please select a valid language.";
    await expect(el.querySelector(".error")).toHaveTextContent(
      "Please select a valid language.",
    );

    el.error = "";
    await expect(el.querySelector(".error")).toHaveTextContent("");
  },
};

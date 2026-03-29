import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./form-textbox.ts";
import "./form-textbox.css";
import type { Component } from "@zeix/le-truc";
import type { FormTextboxProps } from "./form-textbox.ts";

type FormTextboxArgs = {
  error: string;
  description: string;
  clearable: boolean;
};

const meta: Meta<FormTextboxArgs> = {
  title: "Form/Textbox",
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
    clearable: {
      control: "boolean",
      description:
        "When present, a clear button is included (show/hide driven by <code>length</code>)",
      table: {
        defaultValue: { summary: "false" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<FormTextboxArgs>;

export const Default: Story = {
  args: {
    error: "",
    description: "Tell us how you want us to call you.",
    clearable: false,
  },
  render: ({ error, description, clearable }) => `
    <form-textbox${clearable ? " clearable" : ""}>
      <label for="name-input">Name</label>
      <div class="input">
        <input type="text" id="name-input" name="name" autocomplete="name" required />
        ${clearable ? `<button type="button" class="clear" aria-label="Clear input" hidden>✕</button>` : ""}
      </div>
      <p class="error" role="alert" aria-live="assertive" id="name-error">${error}</p>
      <p class="description" aria-live="polite" id="name-description">${description}</p>
    </form-textbox>
  `,
};

export const WithClear: Story = {
  render: () => `
    <form-textbox clearable>
      <label for="search-input">Search terms</label>
      <div class="input">
        <input
          type="text"
          id="search-input"
          name="query"
          autocomplete="off"
          placeholder="apple banana"
        />
        <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
      </div>
    </form-textbox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-textbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-textbox",
    ) as Component<FormTextboxProps>;
    const input = canvas.getByRole("textbox");

    await expect(el.length).toBe(0);

    await userEvent.type(input, "hello");
    await expect(el.value).toBe("hello");
    await expect(el.length).toBe(5);

    el.clear();
    await expect(el.value).toBe("");
    await expect(el.length).toBe(0);
  },
};

export const WithTextarea: Story = {
  render: () => `
    <form-textbox>
      <label for="comment-input">Comment</label>
      <div class="input">
        <textarea
          id="comment-input"
          name="comment"
          autocomplete="off"
          maxlength="200"
        ></textarea>
      </div>
      <p class="error" role="alert" aria-live="assertive" id="comment-error"></p>
      <p
        class="description"
        aria-live="polite"
        id="comment-description"
        data-remaining="\${n} characters remaining"
      ></p>
    </form-textbox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-textbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-textbox",
    ) as Component<FormTextboxProps>;
    const textarea = canvas.getByRole("textbox");
    const description = el.querySelector(".description");

    // Initial: 200 remaining
    await expect(description).toHaveTextContent("200 characters remaining");

    await userEvent.type(textarea, "Hello");
    await expect(description).toHaveTextContent("195 characters remaining");
  },
};

export const WithValidation: Story = {
  render: () => `
    <form-textbox>
      <label for="email-input">Email</label>
      <div class="input">
        <input type="email" id="email-input" name="email" required />
      </div>
      <p class="error" role="alert" aria-live="assertive" id="email-error"></p>
    </form-textbox>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-textbox");
    const el = canvasElement.querySelector(
      "form-textbox",
    ) as Component<FormTextboxProps>;
    const errorEl = el.querySelector(".error");

    el.error = "Please enter a valid email address.";
    await expect(errorEl).toHaveTextContent(
      "Please enter a valid email address.",
    );

    el.error = "";
    await expect(errorEl).toHaveTextContent("");
  },
};

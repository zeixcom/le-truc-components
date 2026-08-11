import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { FormTokenbox, type FormTokenboxArgs } from "./form-tokenbox.html";
import "./form-tokenbox.ts";
import "./form-tokenbox.css";
import type { FormAssociatedElement } from "@zeix/le-truc";
import type { FormTokenboxProps } from "./form-tokenbox.ts";

const meta: Meta<FormTokenboxArgs> = {
  title: "Form/Tokenbox",
  render: FormTokenbox,
  argTypes: {
    value: {
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
    inputType: {
      control: { type: "select" },
      options: ["text", "email"],
      description:
        "Native <code>type</code> on the descendant input — gates which candidate tokens pass <code>checkValidity()</code> and get converted to pills",
      table: {
        defaultValue: { summary: "text" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<FormTokenboxArgs>;

export const Default: Story = {
  args: {
    value: "",
    label: "Topics",
    id: "topics-input",
    name: "topics",
    placeholder: "Add a topic",
    description: "Press comma or move focus away to add a topic.",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-tokenbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-tokenbox") as HTMLElement &
      FormAssociatedElement &
      FormTokenboxProps;
    const input = canvas.getByRole("textbox");

    await expect(el.value).toBe("");

    // Comma commits the draft text as a token pill and clears the input.
    await userEvent.type(input, "css,");
    await expect(input).toHaveValue("");
    await expect(el.value).toBe("css");
    await expect(
      canvas.getByRole("button", { name: "Remove css" }),
    ).toBeInTheDocument();

    // Blur commits any remaining draft text.
    await userEvent.type(input, "html");
    await userEvent.tab();
    await expect(el.value).toBe("css, html");

    // Backspace on an empty input removes the last token.
    await userEvent.click(input);
    await userEvent.keyboard("{Backspace}");
    await expect(el.value).toBe("css");

    // Each pill's remove button removes that specific token.
    await userEvent.type(input, "js,");
    await expect(el.value).toBe("css, js");
    await userEvent.click(canvas.getByRole("button", { name: "Remove css" }));
    await expect(el.value).toBe("js");

    // Enter commits the draft text too, and doesn't submit an enclosing form.
    await userEvent.type(input, "typescript{Enter}");
    await expect(input).toHaveValue("");
    await expect(el.value).toBe("js, typescript");
  },
};

export const Recipients: Story = {
  args: {
    value: "",
    label: "Recipients",
    id: "recipients-input",
    name: "recipients",
    inputType: "email",
    placeholder: "name@example.com",
    description: "Enter email addresses, separated by commas.",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-tokenbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-tokenbox") as HTMLElement &
      FormAssociatedElement &
      FormTokenboxProps;
    const input = canvas.getByRole("textbox");
    const errorEl = el.querySelector(".error");

    // An invalid candidate stays in the input; its native validationMessage
    // is relayed to the host and shown in the inline error.
    await userEvent.type(input, "not-an-email,");
    await expect(input).toHaveValue("not-an-email");
    await expect(el.value).toBe("");
    await expect(el.validity.valid).toBe(false);
    await expect(errorEl).not.toHaveTextContent("");

    // Fixing it and retrying converts it to a token.
    await userEvent.clear(input);
    await userEvent.type(input, "person@example.com,");
    await expect(input).toHaveValue("");
    await expect(el.value).toBe("person@example.com");
    await expect(el.validity.valid).toBe(true);
    await expect(errorEl).toHaveTextContent("");
  },
};

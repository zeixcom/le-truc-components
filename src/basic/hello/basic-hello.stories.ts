import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { BasicHello, type BasicHelloArgs } from "./basic-hello.html";
import "./basic-hello.ts";
import type { BasicHelloProps } from "./basic-hello.ts";

const meta: Meta<BasicHelloArgs> = {
  title: "Basic/Hello",
  render: BasicHello,
  argTypes: {
    subject: {
      control: "text",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<BasicHelloArgs>;

export const Default: Story = {
  args: {
    subject: "World",
  },
};

export const DynamicUpdates: Story = {
  args: { subject: "World" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("basic-hello") as HTMLElement &
      BasicHelloProps;
    const input = canvas.getByRole("textbox");
    const output = el.querySelector("output");

    await expect(output).toHaveTextContent("World");

    await userEvent.clear(input);
    await userEvent.type(input, "Alice");
    await expect(output).toHaveTextContent("Alice");

    await userEvent.clear(input);
    await userEvent.type(input, "Bob");
    await expect(output).toHaveTextContent("Bob");
  },
};

export const FallbackOnClear: Story = {
  args: { subject: "World" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("basic-hello") as HTMLElement &
      BasicHelloProps;
    const input = canvas.getByRole("textbox");
    const output = el.querySelector("output");

    await userEvent.type(input, "Alice");
    await expect(output).toHaveTextContent("Alice");

    await userEvent.clear(input);
    await expect(output).toHaveTextContent("World");
  },
};

export const InitialDOMValue: Story = {
  args: { subject: "Alice" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const el = canvasElement.querySelector("basic-hello") as HTMLElement &
      BasicHelloProps;
    const output = el.querySelector("output");

    await expect(output).toHaveTextContent("Alice");
    await expect(el.subject).toBe("Alice");
  },
};

export const PropertyChanges: Story = {
  args: { subject: "World" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const el = canvasElement.querySelector("basic-hello") as HTMLElement &
      BasicHelloProps;
    const output = el.querySelector("output");

    el.subject = "Charlie";
    await expect(output).toHaveTextContent("Charlie");

    el.subject = "Dana";
    await expect(output).toHaveTextContent("Dana");
  },
};

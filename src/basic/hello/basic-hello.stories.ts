import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./basic-hello.ts";
import type { BasicHelloProps } from "./basic-hello.ts";

type BasicHelloArgs = {
  name: string;
};

const render = ({ name }: BasicHelloArgs) => html`
  <basic-hello>
    <label for="hello-name">Your name</label><br />
    <input id="hello-name" name="name" type="text" autocomplete="given-name" />
    <p>Hello, <output for="hello-name">${name}</output>!</p>
  </basic-hello>
`;

const meta: Meta<BasicHelloArgs> = {
  title: "Basic/Hello",
  render,
  argTypes: {
    name: {
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
    name: "World",
  },
};

export const DynamicUpdates: Story = {
  args: { name: "World" },
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
  args: { name: "World" },
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
  args: { name: "Alice" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const el = canvasElement.querySelector("basic-hello") as HTMLElement &
      BasicHelloProps;
    const output = el.querySelector("output");

    await expect(output).toHaveTextContent("Alice");
    await expect(el.name).toBe("Alice");
  },
};

export const PropertyChanges: Story = {
  args: { name: "World" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const el = canvasElement.querySelector("basic-hello") as HTMLElement &
      BasicHelloProps;
    const output = el.querySelector("output");

    el.name = "Charlie";
    await expect(output).toHaveTextContent("Charlie");

    el.name = "Dana";
    await expect(output).toHaveTextContent("Dana");
  },
};

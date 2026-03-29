import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./basic-hello.ts";
import type { Component } from "@zeix/le-truc";
import type { BasicHelloProps } from "./basic-hello.ts";

type BasicHelloArgs = {
  name: string;
};

const meta: Meta<BasicHelloArgs> = {
  title: "Basic/Hello",
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
  render: ({ name }) => `
    <basic-hello>
      <label for="hello-name">Your name</label><br />
      <input id="hello-name" name="name" type="text" autocomplete="given-name" />
      <p>Hello, <output for="hello-name">${name}</output>!</p>
    </basic-hello>
  `,
};

export const DynamicUpdates: Story = {
  render: () => `
    <basic-hello>
      <label for="hello-name">Your name</label><br />
      <input id="hello-name" name="name" type="text" autocomplete="given-name" />
      <p>Hello, <output for="hello-name">World</output>!</p>
    </basic-hello>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "basic-hello",
    ) as Component<BasicHelloProps>;
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
  render: () => `
    <basic-hello>
      <label for="hello-name">Your name</label><br />
      <input id="hello-name" name="name" type="text" autocomplete="given-name" />
      <p>Hello, <output for="hello-name">World</output>!</p>
    </basic-hello>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "basic-hello",
    ) as Component<BasicHelloProps>;
    const input = canvas.getByRole("textbox");
    const output = el.querySelector("output");

    await userEvent.type(input, "Alice");
    await expect(output).toHaveTextContent("Alice");

    await userEvent.clear(input);
    await expect(output).toHaveTextContent("World");
  },
};

export const InitialDOMValue: Story = {
  render: () => `
    <basic-hello>
      <label for="hello-name">Your name</label><br />
      <input id="hello-name" name="name" type="text" autocomplete="given-name" />
      <p>Hello, <output for="hello-name">Alice</output>!</p>
    </basic-hello>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const el = canvasElement.querySelector(
      "basic-hello",
    ) as Component<BasicHelloProps>;
    const output = el.querySelector("output");

    await expect(output).toHaveTextContent("Alice");
    await expect(el.name).toBe("Alice");
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <basic-hello>
      <label for="hello-name">Your name</label><br />
      <input id="hello-name" name="name" type="text" autocomplete="given-name" />
      <p>Hello, <output for="hello-name">World</output>!</p>
    </basic-hello>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-hello");
    const el = canvasElement.querySelector(
      "basic-hello",
    ) as Component<BasicHelloProps>;
    const output = el.querySelector("output");

    el.name = "Charlie";
    await expect(output).toHaveTextContent("Charlie");

    el.name = "Dana";
    await expect(output).toHaveTextContent("Dana");
  },
};

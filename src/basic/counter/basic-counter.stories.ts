import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { BasicCounter, type BasicCounterArgs } from "./basic-counter.html";
import "./basic-counter.ts";
import "./basic-counter.css";
import type { BasicCounterProps } from "./basic-counter.ts";

const meta: Meta<BasicCounterArgs> = {
  title: "Basic/Counter",
  render: BasicCounter,
  argTypes: {
    count: {
      control: "number",
      table: {
        defaultValue: { summary: "0" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<BasicCounterArgs>;

export const Default: Story = {
  args: {
    count: 42,
  },
};

export const DynamicUpdates: Story = {
  args: { count: 0 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-counter");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("basic-counter") as HTMLElement &
      BasicCounterProps;
    const button = canvas.getByRole("button");
    const span = el.querySelector("span");

    await expect(span).toHaveTextContent("0");

    await userEvent.click(button);
    await expect(span).toHaveTextContent("1");

    await userEvent.click(button);
    await userEvent.click(button);
    await expect(span).toHaveTextContent("3");
  },
};

export const InitialDOMValue: Story = {
  args: { count: 100 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-counter");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("basic-counter") as HTMLElement &
      BasicCounterProps;
    const span = el.querySelector("span");

    await expect(span).toHaveTextContent("100");
    await expect(el.count).toBe(100);

    await userEvent.click(canvas.getByRole("button"));
    await expect(span).toHaveTextContent("101");
  },
};

export const NegativeInitialValue: Story = {
  args: { count: -5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-counter");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("basic-counter") as HTMLElement &
      BasicCounterProps;
    const span = el.querySelector("span");

    await expect(span).toHaveTextContent("-5");

    await userEvent.click(canvas.getByRole("button"));
    await expect(span).toHaveTextContent("-4");

    await userEvent.click(canvas.getByRole("button"));
    await expect(span).toHaveTextContent("-3");
  },
};

export const PropertyChanges: Story = {
  args: { count: 0 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-counter");
    const el = canvasElement.querySelector("basic-counter") as HTMLElement &
      BasicCounterProps;
    const span = el.querySelector("span");

    el.count = 10;
    await expect(span).toHaveTextContent("10");

    el.count = -1;
    await expect(span).toHaveTextContent("-1");
  },
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { expect } from "storybook/test";
import { type BasicGaugeArgs, Gauge } from "./basic-gauge.html";
import "./basic-gauge.ts";
import "./basic-gauge.css";
import "../number/basic-number.ts";
import type { BasicGaugeProps } from "./basic-gauge.ts";

const defaultThresholds = JSON.stringify([
  { min: 0.8, label: "Good job!", color: "var(--color-green-70)" },
  { min: 0.5, label: "Decent", color: "var(--color-orange-70)" },
  { min: 0, label: "Try again!", color: "var(--color-pink-70)" },
]);

const meta: Meta<BasicGaugeArgs> = {
  title: "Basic/Gauge",
  render: Gauge,
  argTypes: {
    value: {
      control: "number",
      table: {
        defaultValue: { summary: "0" },
        category: "Reactive Properties",
      },
    },
    thresholds: {
      control: "text",
      description:
        "JSON array of threshold ranges, sorted from highest to lowest <code>min</code>; each entry has <code>min</code> (number), <code>label</code> (string) and <code>color</code> (CSS color string)",
      table: { category: "Attributes" },
    },
  },
};
export default meta;
type Story = StoryObj<BasicGaugeArgs>;

export const Default: Story = {
  args: {
    value: 0.84,
    thresholds: defaultThresholds,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-gauge");
    const el = canvasElement.querySelector("basic-gauge") as HTMLElement &
      BasicGaugeProps;

    // Threshold label is derived from the value.
    await expect(el.querySelector(".label")?.textContent).toBe("Good job!");

    // Setting the value property updates the label reactively.
    el.value = 0.1;
    await expect(el.querySelector(".label")?.textContent).toBe("Try again!");
  },
};

export const Decent: Story = {
  args: {
    value: 0.65,
    thresholds: defaultThresholds,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-gauge");
    const el = canvasElement.querySelector("basic-gauge");
    await expect(el?.querySelector(".label")?.textContent).toBe("Decent");
  },
};

export const TryAgain: Story = {
  args: {
    value: 0.20566788,
    thresholds: defaultThresholds,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-gauge");
    const el = canvasElement.querySelector("basic-gauge");
    await expect(el?.querySelector(".label")?.textContent).toBe("Try again!");
  },
};

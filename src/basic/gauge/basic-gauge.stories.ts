import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect } from "storybook/test";
import "./basic-gauge.ts";
import "./basic-gauge.css";
import "../number/basic-number.ts";

const thresholds = JSON.stringify([
  { min: 0.8, label: "Good job!", color: "var(--color-green-70)" },
  { min: 0.5, label: "Decent", color: "var(--color-orange-70)" },
  { min: 0, label: "Try again!", color: "var(--color-pink-70)" },
]);

const gauge = (value: number, labelText: string, id: string) => html`
  <basic-gauge thresholds=${thresholds}>
    <p id=${id}>Speed:</p>
    <meter
      class="visually-hidden"
      value=${value}
      aria-labelledby=${id}
    ></meter>
    <basic-number
      value=${value}
      options='{"style":"percent","maximumFractionDigits":1}'
      >${(value * 100).toFixed(value < 0.21 ? 2 : 0)}%</basic-number
    >
    <small class="label">${labelText}</small>
  </basic-gauge>
`;

const render = () => html`
  ${gauge(0.84, "Good job!", "basic-gauge-label-1")}
  ${gauge(0.65, "Decent", "basic-gauge-label-2")}
  ${gauge(0.20566788, "Try again!", "basic-gauge-label-3")}
`;

const meta: Meta = {
  title: "Basic/Gauge",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-gauge");
    const gauges = canvasElement.querySelectorAll("basic-gauge");
    // Threshold labels are derived from the value.
    await expect(gauges[0]!.querySelector(".label")!.textContent).toBe(
      "Good job!",
    );
    await expect(gauges[2]!.querySelector(".label")!.textContent).toBe(
      "Try again!",
    );
    // Setting the value property updates the label reactively.
    (gauges[0]! as any).value = 0.1;
    await expect(gauges[0]!.querySelector(".label")!.textContent).toBe(
      "Try again!",
    );
  },
};

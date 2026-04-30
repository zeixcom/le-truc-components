import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "./basic-gauge.ts";
import "./basic-gauge.css";
import "../number/basic-number.ts";
import type { BasicGaugeProps } from "./basic-gauge.ts";

const DEFAULT_THRESHOLDS =
  '[{"min":0.8,"label":"Good job!","color":"var(--color-success)"},{"min":0.5,"label":"Decent","color":"var(--color-warning)"},{"min":0,"label":"Try again!","color":"var(--color-error)"}]';

const PROGRESS_THRESHOLDS =
  '[{"min":100,"label":"Full","color":"var(--color-success)"},{"min":75,"label":"Almost there","color":"var(--color-info)"},{"min":50,"label":"Halfway","color":"var(--color-warning)"},{"min":0,"label":"Empty","color":"var(--color-error)"}]';

type BasicGaugeArgs = {
  value: number;
  thresholds: string;
};

const render = ({ value, thresholds }: BasicGaugeArgs) => html`
  <basic-gauge thresholds=${thresholds || nothing}>
    <p>Speed:</p>
    <meter
      class="visually-hidden"
      value=${value}
      min="0"
      max="1"
      aria-label="Speed"
    ></meter>
    <basic-number
      value=${value}
      options='{"style":"percent","maximumFractionDigits":1}'
    ></basic-number>
    <small class="label"></small>
  </basic-gauge>
`;

const meta: Meta<BasicGaugeArgs> = {
  title: "Basic/Gauge",
  render,
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description:
        "Initial value for the gauge (set via the meter element's value attribute)",
      table: {
        defaultValue: { summary: "0" },
        category: "Reactive Properties",
      },
    },
    thresholds: {
      control: "text",
      description:
        "JSON array of threshold objects with min, label, and color properties",
      table: { category: "Attributes" },
    },
  },
};
export default meta;
type Story = StoryObj<BasicGaugeArgs>;

export const Default: Story = {
  args: {
    value: 0.84,
    thresholds: DEFAULT_THRESHOLDS,
  },
};

export const Decent: Story = {
  args: {
    value: 0.65,
    thresholds: DEFAULT_THRESHOLDS,
  },
};

export const TryAgain: Story = {
  args: {
    value: 0.20566788,
    thresholds: DEFAULT_THRESHOLDS,
  },
};

export const PropertyChanges: Story = {
  args: {
    value: 0.5,
    thresholds: DEFAULT_THRESHOLDS,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-gauge");
    const el = canvasElement.querySelector("basic-gauge") as HTMLElement &
      BasicGaugeProps;
    const label = el.querySelector(".label");

    // Initial state based on meter value
    await expect(label).toHaveTextContent("Decent");

    // Update via host property (component watches host.value)
    el.value = 0.9;
    await expect(label).toHaveTextContent("Good job!");

    el.value = 0.3;
    await expect(label).toHaveTextContent("Try again!");
  },
};

export const CustomThresholds: Story = {
  args: {
    value: 75,
    thresholds: PROGRESS_THRESHOLDS,
  },
  render: ({ value, thresholds }) => html`
    <basic-gauge thresholds=${thresholds || nothing}>
      <p>Progress:</p>
      <meter
        class="visually-hidden"
        value=${value}
        min="0"
        max="100"
        aria-label="Progress"
      ></meter>
      <basic-number
        value=${value}
        options='{"style":"percent","maximumFractionDigits":0}'
      ></basic-number>
      <small class="label"></small>
    </basic-gauge>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-gauge");
    const el = canvasElement.querySelector("basic-gauge") as HTMLElement &
      BasicGaugeProps;
    const label = el.querySelector(".label");

    await expect(label).toHaveTextContent("Almost there");
  },
};

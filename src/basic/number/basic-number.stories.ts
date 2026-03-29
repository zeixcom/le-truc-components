import type { Meta, StoryObj } from "@storybook/web-components";
import { expect } from "storybook/test";
import "./basic-number.ts";
import type { Component } from "@zeix/le-truc";
import type { BasicNumberProps } from "./basic-number.ts";

type BasicNumberArgs = {
  value: number;
  options: string;
  lang: string;
};

const meta: Meta<BasicNumberArgs> = {
  title: "Basic/Number",
  argTypes: {
    value: {
      control: "number",
      table: {
        defaultValue: { summary: "0" },
        category: "Reactive Properties",
      },
    },
    options: {
      control: "text",
      description: "JSON options for <code>Intl.NumberFormat</code>",
      table: { category: "Attributes" },
    },
    lang: {
      control: "text",
      description: "BCP 47 language tag for locale",
      table: { category: "Attributes" },
    },
  },
};
export default meta;
type Story = StoryObj<BasicNumberArgs>;

export const Default: Story = {
  args: {
    value: 25678.9,
    options: '{"style":"unit","unit":"liter","unitDisplay":"long"}',
    lang: "",
  },
  render: ({ value, options, lang }) => `
    <basic-number
      value="${value}"
      options='${options}'
      ${lang ? `lang="${lang}"` : ""}
    ></basic-number>
  `,
};

export const Currency: Story = {
  render: () => `
    <p>German (Switzerland):<br />
    <basic-number
      lang="de-CH"
      value="25678.9"
      options='{"style":"currency","currency":"CHF"}'
    ></basic-number></p>
    <p>French (Switzerland):<br />
    <basic-number
      lang="fr-CH"
      value="25678.9"
      options='{"style":"currency","currency":"CHF"}'
    ></basic-number></p>
  `,
};

export const Unit: Story = {
  render: () => `
    <p>Arabic speed (km/h):<br />
    <basic-number
      lang="ar-EG"
      value="25678.9"
      options='{"style":"unit","unit":"kilometer-per-hour","unitDisplay":"long"}'
    ></basic-number></p>
    <p>Chinese time (seconds):<br />
    <basic-number
      lang="zh-Hans-CN-u-nu-hanidec"
      value="25678.9"
      options='{"style":"unit","unit":"second","unitDisplay":"long"}'
    ></basic-number></p>
  `,
};

export const LocaleInheritance: Story = {
  render: () => `
    <div lang="de-DE">
      <p>Euro currency, inherited German (Germany) locale:<br />
      <basic-number
        value="1234.5"
        options='{"style":"currency","currency":"EUR"}'
      ></basic-number></p>
    </div>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-number");
    const el = canvasElement.querySelector(
      "basic-number",
    ) as Component<BasicNumberProps>;
    await expect(el).toHaveTextContent("1.234,50\u00a0€");
  },
};

export const DecimalFormatting: Story = {
  render: () => `
    <basic-number
      value="1234.56789"
      options='{"style":"decimal","minimumFractionDigits":2,"maximumFractionDigits":3}'
    ></basic-number>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-number");
    const el = canvasElement.querySelector(
      "basic-number",
    ) as Component<BasicNumberProps>;
    await expect(el).toHaveTextContent("1,234.568");
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <basic-number value="0"></basic-number>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-number");
    const el = canvasElement.querySelector(
      "basic-number",
    ) as Component<BasicNumberProps>;

    await expect(el).toHaveTextContent("0");

    el.value = 42;
    await expect(el).toHaveTextContent("42");

    el.value = -1234.5;
    await expect(el).toHaveTextContent("-1,234.5");
  },
};

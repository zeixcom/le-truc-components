import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "./basic-pluralize.ts";
import type { BasicPluralizeProps } from "./basic-pluralize.ts";

type BasicPluralizeArgs = {
  count: number;
  lang: string;
  ordinal: boolean;
};

const render = ({ count, ordinal, lang }: BasicPluralizeArgs) => html`
  <p>Remaining tasks:</p>
  <basic-pluralize count=${count} ?ordinal=${ordinal} lang=${lang || nothing}>
    <p class="none">Well done, all done!</p>
    <p class="some">
      <span class="count"></span>
      task<span class="other">s</span>
      remaining
    </p>
  </basic-pluralize>
`;

const meta: Meta<BasicPluralizeArgs> = {
  title: "Basic/Pluralize",
  render,
  argTypes: {
    count: {
      control: "number",
      table: {
        defaultValue: { summary: "0" },
        category: "Reactive Properties",
      },
    },
    lang: {
      control: "text",
      description: "BCP 47 language tag for locale",
      table: { category: "Attributes" },
    },
    ordinal: {
      control: "boolean",
      description:
        "When present, uses ordinal plural rules instead of cardinal",
      table: {
        defaultValue: { summary: "false" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<BasicPluralizeArgs>;

export const Default: Story = {
  args: {
    count: 0,
    ordinal: false,
    lang: "",
  },
};

// ⚠️ Custom render: uses person/people slot content instead of task/tasks
export const PeopleCount: Story = {
  render: () => html`
    <p>Number of people:</p>
    <basic-pluralize count="1">
      <p class="none">Nobody</p>
      <p class="some">
        <span class="count"></span>
        <span class="one">person</span><span class="other">people</span>
      </p>
    </basic-pluralize>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-pluralize");
    const el = canvasElement.querySelector(
      "basic-pluralize",
    ) as HTMLElement & BasicPluralizeProps;

    await expect(el.querySelector(".none")).not.toBeVisible();
    await expect(el.querySelector(".some")).toBeVisible();
    await expect(el.querySelector(".count")).toHaveTextContent("1");
    await expect(el.querySelector(".one")).toBeVisible();
    await expect(el.querySelector(".other")).not.toBeVisible();

    el.count = 5;
    await expect(el.querySelector(".count")).toHaveTextContent("5");
    await expect(el.querySelector(".one")).not.toBeVisible();
    await expect(el.querySelector(".other")).toBeVisible();

    el.count = 0;
    await expect(el.querySelector(".none")).toBeVisible();
    await expect(el.querySelector(".some")).not.toBeVisible();
  },
};

// ⚠️ Custom render: uses ordinal suffix slots (st/nd/rd/th) instead of task/tasks
export const Ordinal: Story = {
  render: () => html`
    <p>Item selected:</p>
    <basic-pluralize count="1" ordinal>
      <p class="none">None</p>
      <p class="some">
        <span class="count"></span><span class="one">st</span><span class="two">nd</span><span class="few">rd</span><span class="other">th</span>
      </p>
    </basic-pluralize>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-pluralize");
    const el = canvasElement.querySelector(
      "basic-pluralize",
    ) as HTMLElement & BasicPluralizeProps;

    await expect(el.querySelector(".count")).toHaveTextContent("1");
    await expect(el.querySelector(".one")).toBeVisible(); // 1st
    await expect(el.querySelector(".two")).not.toBeVisible();

    el.count = 2;
    await expect(el.querySelector(".two")).toBeVisible(); // 2nd
    await expect(el.querySelector(".one")).not.toBeVisible();

    el.count = 3;
    await expect(el.querySelector(".few")).toBeVisible(); // 3rd

    el.count = 4;
    await expect(el.querySelector(".other")).toBeVisible(); // 4th
  },
};

// ⚠️ Custom render: wrapped in div[lang="cy"] to test Welsh plural categories (zero/one/two/few/many/other)
export const Welsh: Story = {
  render: () => html`
    <div lang="cy">
      <p>Number of dogs in Welsh:</p>
      <basic-pluralize count="0">
        <p class="none">Dim anifeiliaid!</p>
        <p class="some">
          <span class="count"></span>
          <span class="zero">cŵn</span>
          <span class="one">ci</span>
          <span class="two">gi</span>
          <span class="few">chi</span>
          <span class="many">chi</span>
          <span class="other">ci</span>
        </p>
      </basic-pluralize>
    </div>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-pluralize");
    const el = canvasElement.querySelector(
      "basic-pluralize",
    ) as HTMLElement & BasicPluralizeProps;

    // count=0 → .none shown, .some hidden
    await expect(el.querySelector(".none")).toBeVisible();
    await expect(el.querySelector(".some")).not.toBeVisible();

    el.count = 1; // ci (one)
    await expect(el.querySelector(".one")).toBeVisible();

    el.count = 2; // gi (two)
    await expect(el.querySelector(".two")).toBeVisible();

    el.count = 3; // chi (few)
    await expect(el.querySelector(".few")).toBeVisible();

    el.count = 6; // chi (many)
    await expect(el.querySelector(".many")).toBeVisible();
  },
};

// ⚠️ Custom render: uses simpler "items" slot content to test that negative count is clamped to zero
export const NegativeClampedToZero: Story = {
  render: () => html`
    <basic-pluralize count="-5">
      <p class="none">Zero (negative clamped)</p>
      <p class="some"><span class="count"></span> items</p>
    </basic-pluralize>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("basic-pluralize");
    const el = canvasElement.querySelector(
      "basic-pluralize",
    ) as HTMLElement & BasicPluralizeProps;

    await expect(el.count).toBe(0);
    await expect(el.querySelector(".none")).toBeVisible();
    await expect(el.querySelector(".some")).not.toBeVisible();
  },
};

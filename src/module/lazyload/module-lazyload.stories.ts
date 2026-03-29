import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, waitFor } from "storybook/test";
import "./module-lazyload.ts";
import "../../card/callout/card-callout.css";
import type { Component } from "@zeix/le-truc";
import type { ModuleLazyloadProps } from "./module-lazyload.ts";

type ModuleLazyloadArgs = {
  src: string;
  "allow-scripts": boolean;
};

const meta: Meta<ModuleLazyloadArgs> = {
  title: "Module/Lazyload",
  argTypes: {
    src: {
      control: "text",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
    "allow-scripts": {
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleLazyloadArgs>;

export const Default: Story = {
  args: {
    src: "",
    "allow-scripts": false,
  },
  render: ({ src, "allow-scripts": allowScripts }) => `
    <module-lazyload${src ? ` src="${src}"` : ""}${allowScripts ? " allow-scripts" : ""}>
      <card-callout>
        <p class="loading" role="status">Loading...</p>
        <p class="error" role="alert" aria-live="assertive" hidden></p>
      </card-callout>
      <div class="content" hidden></div>
    </module-lazyload>
  `,
};

export const WithContent: Story = {
  args: {
    src: "/mocks/lazyload/simple-text.html",
    "allow-scripts": false,
  },
  render: ({ src, "allow-scripts": allowScripts }) => `
    <module-lazyload${src ? ` src="${src}"` : ""}${allowScripts ? " allow-scripts" : ""}>
      <card-callout>
        <p class="loading" role="status">Loading...</p>
        <p class="error" role="alert" aria-live="assertive" hidden></p>
      </card-callout>
      <div class="content" hidden></div>
    </module-lazyload>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as Component<ModuleLazyloadProps>;
    const content = canvasElement.querySelector(".content");

    await waitFor(() => expect(content).toBeVisible());
    await expect(el.src).toBe("/mocks/lazyload/simple-text.html");
  },
};

export const NoSrc: Story = {
  render: () => `
    <module-lazyload>
      <card-callout>
        <p class="loading" role="status">Loading...</p>
        <p class="error" role="alert" aria-live="assertive" hidden></p>
      </card-callout>
      <div class="content" hidden></div>
    </module-lazyload>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as Component<ModuleLazyloadProps>;

    await expect(el.src).toBe("");
  },
};

export const InvalidURL: Story = {
  render: () => `
    <module-lazyload src="not-a-valid-url">
      <card-callout>
        <p class="loading" role="status">Loading...</p>
        <p class="error" role="alert" aria-live="assertive" hidden></p>
      </card-callout>
      <div class="content" hidden></div>
    </module-lazyload>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as Component<ModuleLazyloadProps>;
    const errorEl = canvasElement.querySelector(".error");

    await expect(el.src).toBe("not-a-valid-url");
    await waitFor(() => expect(errorEl).toBeVisible());
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <module-lazyload>
      <card-callout>
        <p class="loading" role="status">Loading...</p>
        <p class="error" role="alert" aria-live="assertive" hidden></p>
      </card-callout>
      <div class="content" hidden></div>
    </module-lazyload>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as Component<ModuleLazyloadProps>;

    await expect(el.src).toBe("");

    el.src = "not-a-valid-url";
    await expect(el.src).toBe("not-a-valid-url");
  },
};

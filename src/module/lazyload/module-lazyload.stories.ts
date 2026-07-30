import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect, waitFor } from "storybook/test";
import "./module-lazyload.ts";
import "../../card/callout/card-callout.css";
import type { ModuleLazyloadProps } from "./module-lazyload.ts";

type ModuleLazyloadArgs = {
  src: string;
  "allow-scripts": boolean;
};

const render = ({ src, "allow-scripts": allowScripts }: ModuleLazyloadArgs) => html`
  <module-lazyload src=${src || nothing} ?allow-scripts=${allowScripts}>
    <card-callout>
      <p class="loading" role="status">Loading...</p>
      <p class="error" role="alert" aria-live="assertive" hidden></p>
    </card-callout>
    <div class="content" hidden></div>
  </module-lazyload>
`;

const meta: Meta<ModuleLazyloadArgs> = {
  title: "Module/Lazyload",
  render,
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
};

export const WithContent: Story = {
  args: {
    src: "/mocks/lazyload/simple-text.html",
    "allow-scripts": false,
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as HTMLElement & ModuleLazyloadProps;
    const content = canvasElement.querySelector(".content");

    await waitFor(() => expect(content).toBeVisible());
    await expect(el.src).toBe("/mocks/lazyload/simple-text.html");
  },
};

export const NoSrc: Story = {
  args: { src: "", "allow-scripts": false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as HTMLElement & ModuleLazyloadProps;

    await expect(el.src).toBe("");
  },
};

export const InvalidURL: Story = {
  // A cross-origin URL (here a different port) is rejected by `isValidURL`,
  // so `createTask` throws and the `err` branch shows the error. Note: a
  // same-origin relative path like "not-a-valid-url" is actually a *valid*
  // relative URL, and the Vite dev server answers unknown same-origin paths
  // with a 200 SPA fallback — so the task resolved `ok` and `.error` never
  // appeared. A cross-origin URL is rejected before any fetch, deterministically.
  args: { src: "http://localhost:9/nonexistent", "allow-scripts": false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as HTMLElement & ModuleLazyloadProps;
    const errorEl = canvasElement.querySelector(".error");

    await expect(el.src).toBe("http://localhost:9/nonexistent");
    await waitFor(() => expect(errorEl).toBeVisible());
  },
};

export const PropertyChanges: Story = {
  args: { src: "", "allow-scripts": false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector(
      "module-lazyload",
    ) as HTMLElement & ModuleLazyloadProps;

    await expect(el.src).toBe("");

    el.src = "not-a-valid-url";
    await expect(el.src).toBe("not-a-valid-url");
  },
};

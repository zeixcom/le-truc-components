import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, waitFor } from "storybook/test";
import {
  ModuleLazyload,
  type ModuleLazyloadArgs,
} from "./module-lazyload.html";
import "./module-lazyload.ts";
import "../../card/callout/card-callout.css";
import type { ModuleLazyloadProps } from "./module-lazyload.ts";

const meta: Meta<ModuleLazyloadArgs> = {
  title: "Module/Lazyload",
  render: ModuleLazyload,
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
    const el = canvasElement.querySelector("module-lazyload") as HTMLElement &
      ModuleLazyloadProps;
    const content = canvasElement.querySelector(".content");

    await waitFor(() => expect(content).toBeVisible());
    await expect(el.src).toBe("/mocks/lazyload/simple-text.html");
  },
};

export const NoSrc: Story = {
  args: { src: "", "allow-scripts": false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector("module-lazyload") as HTMLElement &
      ModuleLazyloadProps;

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
    const el = canvasElement.querySelector("module-lazyload") as HTMLElement &
      ModuleLazyloadProps;
    const errorEl = canvasElement.querySelector(".error");

    await expect(el.src).toBe("http://localhost:9/nonexistent");
    await waitFor(() => expect(errorEl).toBeVisible());
  },
};

export const PropertyChanges: Story = {
  args: { src: "", "allow-scripts": false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-lazyload");
    const el = canvasElement.querySelector("module-lazyload") as HTMLElement &
      ModuleLazyloadProps;

    await expect(el.src).toBe("");

    el.src = "not-a-valid-url";
    await expect(el.src).toBe("not-a-valid-url");
  },
};

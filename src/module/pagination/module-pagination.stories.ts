import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./module-pagination.ts";
import "./module-pagination.css";
import type { Component } from "@zeix/le-truc";
import type { ModulePaginationProps } from "./module-pagination.ts";

type ModulePaginationArgs = {
  value: number;
  max: number;
};

const meta: Meta<ModulePaginationArgs> = {
  title: "Module/Pagination",
  argTypes: {
    value: {
      control: "number",
      table: {
        defaultValue: { summary: "parsed from input value (1 if missing)" },
        category: "Reactive Properties",
      },
    },
    max: {
      control: "number",
      table: {
        defaultValue: { summary: "parsed from input max (1 if missing)" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModulePaginationArgs>;

export const Default: Story = {
  args: {
    value: 1,
    max: 10,
  },
  render: ({ value, max }) => `
    <module-pagination>
      <div>
        <label>
          <span class="visually-hidden">Page</span>
          <input type="number" name="page" min="1" max="${max}" value="${value}" />
        </label>
        <span class="value visually-hidden" aria-current="page">${value}</span> of
        <span class="max">${max}</span>
      </div>
      <div class="buttons">
        <button type="button" class="prev"${value <= 1 ? " disabled" : ""} aria-label="Previous page">❮</button>
        <button type="button" class="next"${value >= max ? " disabled" : ""} aria-label="Next page">❯</button>
      </div>
    </module-pagination>
  `,
};

export const Navigation: Story = {
  render: () => `
    <module-pagination>
      <div>
        <label>
          <span class="visually-hidden">Page</span>
          <input type="number" name="page" min="1" max="5" value="1" />
        </label>
        <span class="value visually-hidden" aria-current="page">1</span> of
        <span class="max">5</span>
      </div>
      <div class="buttons">
        <button type="button" class="prev" disabled aria-label="Previous page">❮</button>
        <button type="button" class="next" aria-label="Next page">❯</button>
      </div>
    </module-pagination>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-pagination",
    ) as Component<ModulePaginationProps>;
    const next = canvas.getByRole("button", { name: "Next page" });
    const prev = canvas.getByRole("button", { name: "Previous page" });

    await expect(el.value).toBe(1);
    await expect(el.max).toBe(5);
    await expect(prev).toBeDisabled();

    await userEvent.click(next);
    await expect(el.value).toBe(2);
    await expect(prev).not.toBeDisabled();

    await userEvent.click(next);
    await userEvent.click(next);
    await userEvent.click(next);
    await expect(el.value).toBe(5);
    await expect(next).toBeDisabled();
  },
};

export const ClampedAtBounds: Story = {
  render: () => `
    <module-pagination>
      <div>
        <label>
          <span class="visually-hidden">Page</span>
          <input type="number" name="page" min="1" max="3" value="3" />
        </label>
        <span class="value visually-hidden" aria-current="page">3</span> of
        <span class="max">3</span>
      </div>
      <div class="buttons">
        <button type="button" class="prev" aria-label="Previous page">❮</button>
        <button type="button" class="next" disabled aria-label="Next page">❯</button>
      </div>
    </module-pagination>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-pagination",
    ) as Component<ModulePaginationProps>;
    const next = canvas.getByRole("button", { name: "Next page" });

    await expect(el.value).toBe(3);
    await expect(el.max).toBe(3);
    await expect(next).toBeDisabled();
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <module-pagination>
      <div>
        <label>
          <span class="visually-hidden">Page</span>
          <input type="number" name="page" min="1" max="10" value="1" />
        </label>
        <span class="value visually-hidden" aria-current="page">1</span> of
        <span class="max">10</span>
      </div>
      <div class="buttons">
        <button type="button" class="prev" disabled aria-label="Previous page">❮</button>
        <button type="button" class="next" aria-label="Next page">❯</button>
      </div>
    </module-pagination>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const el = canvasElement.querySelector(
      "module-pagination",
    ) as Component<ModulePaginationProps>;

    await expect(el.value).toBe(1);
    await expect(el.max).toBe(10);

    el.value = 5;
    await expect(el.value).toBe(5);

    el.max = 20;
    await expect(el.max).toBe(20);
  },
};

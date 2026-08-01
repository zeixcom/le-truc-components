import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import {
  type ModulePaginationArgs,
  Pagination,
} from "./module-pagination.html";
import "./module-pagination.ts";
import "./module-pagination.css";
import type { ModulePaginationProps } from "./module-pagination.ts";

const meta: Meta<ModulePaginationArgs> = {
  title: "Module/Pagination",
  render: Pagination,
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
};

export const Navigation: Story = {
  args: { value: 1, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-pagination") as HTMLElement &
      ModulePaginationProps;
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
  args: { value: 3, max: 3 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-pagination") as HTMLElement &
      ModulePaginationProps;
    const next = canvas.getByRole("button", { name: "Next page" });

    await expect(el.value).toBe(3);
    await expect(el.max).toBe(3);
    await expect(next).toBeDisabled();
  },
};

export const KeyboardNavigation: Story = {
  args: { value: 2, max: 3 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-pagination") as HTMLElement &
      ModulePaginationProps;
    const next = canvas.getByRole("button", { name: "Next page" });
    const prev = canvas.getByRole("button", { name: "Previous page" });

    // Reaching the lower bound while focused on prev shifts focus to next.
    await expect(el.value).toBe(2);
    prev.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.value).toBe(1);
    await expect(document.activeElement).toBe(next);
    await expect(prev).toBeDisabled();

    // Reset and verify the mirror case: reaching the upper bound while
    // focused on next shifts focus to prev.
    el.value = 2;
    next.focus();
    await userEvent.keyboard("+");
    await expect(el.value).toBe(3);
    await expect(document.activeElement).toBe(prev);
    await expect(next).toBeDisabled();

    // "-" decrements same as ArrowLeft.
    await userEvent.keyboard("-");
    await expect(el.value).toBe(2);

    // Unrelated key: no change.
    await userEvent.keyboard("a");
    await expect(el.value).toBe(2);

    // Typing inside the input itself is ignored by the host keyup handler.
    const input = canvasElement.querySelector("input") as HTMLInputElement;
    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.value).toBe(2);
  },
};

export const InputChange: Story = {
  args: { value: 1, max: 5 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const el = canvasElement.querySelector("module-pagination") as HTMLElement &
      ModulePaginationProps;
    const input = canvasElement.querySelector("input") as HTMLInputElement;

    input.valueAsNumber = 10;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(el.value).toBe(5);
    await expect(input.valueAsNumber).toBe(5);

    input.valueAsNumber = -3;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(el.value).toBe(1);
    await expect(input.valueAsNumber).toBe(1);

    input.value = "";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(el.value).toBe(1);
  },
};

export const PropertyChanges: Story = {
  args: { value: 1, max: 10 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-pagination");
    const el = canvasElement.querySelector("module-pagination") as HTMLElement &
      ModulePaginationProps;

    await expect(el.value).toBe(1);
    await expect(el.max).toBe(10);

    el.value = 5;
    await expect(el.value).toBe(5);

    el.max = 20;
    await expect(el.max).toBe(20);
  },
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { Dialog, type ModuleDialogArgs } from "./module-dialog.html";
import "./module-dialog.ts";
import "./module-dialog.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../module/scrollarea/module-scrollarea.ts";
import "../../module/scrollarea/module-scrollarea.css";
import type { ModuleDialogProps } from "./module-dialog.ts";

const meta: Meta<ModuleDialogArgs> = {
  title: "Module/Dialog",
  render: Dialog,
  argTypes: {
    open: {
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleDialogArgs>;

export const Default: Story = {
  args: {
    open: false,
  },
};

export const OpenClose: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-dialog");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-dialog") as HTMLElement &
      ModuleDialogProps;

    await expect(el.open).toBe(false);

    const openButton = canvas.getByRole("button", { name: "Open dialog" });
    await userEvent.click(openButton);
    await expect(el.open).toBe(true);

    const closeButton = canvas.getByRole("button", { name: "Close dialog" });
    await userEvent.click(closeButton);
    await expect(el.open).toBe(false);
  },
};

export const PropertyChanges: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-dialog");
    const el = canvasElement.querySelector("module-dialog") as HTMLElement &
      ModuleDialogProps;

    await expect(el.open).toBe(false);

    el.open = true;
    await expect(el.open).toBe(true);

    el.open = false;
    await expect(el.open).toBe(false);
  },
};

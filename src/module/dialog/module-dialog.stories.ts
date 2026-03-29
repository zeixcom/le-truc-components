import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./module-dialog.ts";
import "./module-dialog.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../module/scrollarea/module-scrollarea.ts";
import "../../module/scrollarea/module-scrollarea.css";
import type { Component } from "@zeix/le-truc";
import type { ModuleDialogProps } from "./module-dialog.ts";

type ModuleDialogArgs = {
  open: boolean;
};

const meta: Meta<ModuleDialogArgs> = {
  title: "Module/Dialog",
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
  render: () => `
    <module-dialog>
      <basic-button>
        <button type="button" aria-haspopup="dialog" aria-controls="story-dialog">
          Open dialog
        </button>
      </basic-button>
      <dialog id="story-dialog" aria-labelledby="story-dialog-title">
        <header>
          <h2 id="story-dialog-title">Dialog Title</h2>
          <button type="button" class="close" aria-label="Close dialog">×</button>
        </header>
        <module-scrollarea orientation="vertical">
          <form method="dialog">
            <div class="content">
              <p>This is the dialog content. It can contain any HTML elements including forms, images, and other components.</p>
              <p>Press Escape, click the close button, or click outside the dialog to close it.</p>
            </div>
          </form>
        </module-scrollarea>
      </dialog>
    </module-dialog>
  `,
};

export const OpenClose: Story = {
  render: () => `
    <module-dialog>
      <basic-button>
        <button type="button" aria-haspopup="dialog" aria-controls="openclose-dialog">
          Open dialog
        </button>
      </basic-button>
      <dialog id="openclose-dialog" aria-labelledby="openclose-dialog-title">
        <header>
          <h2 id="openclose-dialog-title">Test Dialog</h2>
          <button type="button" class="close" aria-label="Close dialog">×</button>
        </header>
        <module-scrollarea orientation="vertical">
          <form method="dialog">
            <div class="content">
              <p>Click the close button or press Escape to close this dialog.</p>
            </div>
          </form>
        </module-scrollarea>
      </dialog>
    </module-dialog>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-dialog");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-dialog",
    ) as Component<ModuleDialogProps>;

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
  render: () => `
    <module-dialog>
      <basic-button>
        <button type="button" aria-haspopup="dialog" aria-controls="prop-dialog">
          Open dialog
        </button>
      </basic-button>
      <dialog id="prop-dialog" aria-labelledby="prop-dialog-title">
        <header>
          <h2 id="prop-dialog-title">Property Test Dialog</h2>
          <button type="button" class="close" aria-label="Close dialog">×</button>
        </header>
        <module-scrollarea orientation="vertical">
          <form method="dialog">
            <div class="content">
              <p>Dialog content for programmatic open/close testing.</p>
            </div>
          </form>
        </module-scrollarea>
      </dialog>
    </module-dialog>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-dialog");
    const el = canvasElement.querySelector(
      "module-dialog",
    ) as Component<ModuleDialogProps>;

    await expect(el.open).toBe(false);

    el.open = true;
    await expect(el.open).toBe(true);

    el.open = false;
    await expect(el.open).toBe(false);
  },
};

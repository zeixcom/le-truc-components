import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import {
  type ModuleScrollareaArgs,
  Scrollarea,
} from "./module-scrollarea.html";
import "./module-scrollarea.ts";
import "./module-scrollarea.css";

const meta: Meta<ModuleScrollareaArgs> = {
  title: "Module/Scrollarea",
  render: Scrollarea,
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
      table: {
        defaultValue: { summary: "vertical" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleScrollareaArgs>;

export const Default: Story = {
  args: {
    orientation: "vertical",
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

// ⚠️ Custom render: uses a horizontal flex row of fixed-width boxes that require a wider container
export const Horizontal: Story = {
  render: () => html`
    <module-scrollarea orientation="horizontal" style="width: 400px; height: 120px; border: 1px solid #ccc;">
      <div style="display: flex; gap: 20px; width: 800px;">
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">Item 1</div>
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #e0e0e0; display: flex; align-items: center; justify-content: center;">Item 2</div>
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #d0d0d0; display: flex; align-items: center; justify-content: center;">Item 3</div>
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #c0c0c0; display: flex; align-items: center; justify-content: center;">Item 4</div>
      </div>
    </module-scrollarea>
  `,
};

// ⚠️ Custom render: uses short content that does not overflow, to verify no scrollbar appears
export const NoOverflow: Story = {
  render: () => html`
    <module-scrollarea orientation="vertical" style="height: 200px; width: 300px; border: 1px solid #ccc;">
      <div>
        <p>Short content that does not overflow the container.</p>
      </div>
    </module-scrollarea>
  `,
};

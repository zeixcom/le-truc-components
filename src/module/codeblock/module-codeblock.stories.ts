import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../module/scrollarea/module-scrollarea.ts";
import "../../module/scrollarea/module-scrollarea.css";
import "./module-codeblock.ts";
import "./module-codeblock.css";
import type { ModuleCodeblockProps } from "./module-codeblock.ts";

type ModuleCodeblockArgs = {
  collapsed: boolean;
};

const sampleCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

const render = ({ collapsed }: ModuleCodeblockArgs) => html`
  <module-codeblock ?collapsed=${collapsed}>
    <module-scrollarea orientation="horizontal">
      <pre><code class="language-js">${sampleCode}</code></pre>
    </module-scrollarea>
    <basic-button class="copy" copy-success="Copied!" copy-error="Error!">
      <button type="button" class="secondary small">
        <span class="label">Copy</span>
      </button>
    </basic-button>
    <button type="button" class="overlay" aria-expanded=${collapsed ? "false" : "true"}>
      Expand
    </button>
  </module-codeblock>
`;

const meta: Meta<ModuleCodeblockArgs> = {
  title: "Module/Codeblock",
  render,
  argTypes: {
    collapsed: {
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleCodeblockArgs>;

export const Default: Story = {
  args: { collapsed: false },
};

export const Collapsed: Story = {
  args: { collapsed: true },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-codeblock");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-codeblock",
    ) as HTMLElement & ModuleCodeblockProps;

    await expect(el.collapsed).toBe(true);
    await expect(el).toHaveAttribute("collapsed");

    await userEvent.click(canvas.getByText("Expand"));
    await expect(el.collapsed).toBe(false);
    await expect(el).not.toHaveAttribute("collapsed");
  },
};

// ⚠️ Custom render: omits the copy button to test that collapsed property works without the full toolbar
export const PropertyChanges: Story = {
  render: () => html`
    <module-codeblock>
      <module-scrollarea orientation="horizontal">
        <pre><code class="language-js">${sampleCode}</code></pre>
      </module-scrollarea>
      <button type="button" class="overlay" aria-expanded="true">Expand</button>
    </module-codeblock>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-codeblock");
    const el = canvasElement.querySelector(
      "module-codeblock",
    ) as HTMLElement & ModuleCodeblockProps;

    await expect(el.collapsed).toBe(false);

    el.collapsed = true;
    await expect(el).toHaveAttribute("collapsed");

    el.collapsed = false;
    await expect(el).not.toHaveAttribute("collapsed");
  },
};

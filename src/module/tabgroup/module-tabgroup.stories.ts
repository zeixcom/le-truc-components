import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import { ModuleTabgroup } from "./module-tabgroup.html";
import "./module-tabgroup.ts";
import "./module-tabgroup.css";
import type { ModuleTabgroupProps } from "./module-tabgroup.ts";

const meta: Meta = {
  title: "Module/Tabgroup",
  render: ModuleTabgroup,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-tabgroup");
    const el = canvasElement.querySelector("module-tabgroup") as HTMLElement &
      ModuleTabgroupProps;

    await expect(el.selected).toBe("panel1");
  },
};

// ⚠️ Custom render: uses distinct panel labels (Settings/Profile/Security) to test click-driven selection
export const TabNavigation: Story = {
  render: () => html`
    <module-tabgroup>
      <div role="tablist">
        <button type="button" role="tab" aria-controls="nav-panel1" aria-selected="true" tabindex="0">Settings</button>
        <button type="button" role="tab" aria-controls="nav-panel2" aria-selected="false" tabindex="-1">Profile</button>
        <button type="button" role="tab" aria-controls="nav-panel3" aria-selected="false" tabindex="-1">Security</button>
      </div>
      <div role="tabpanel" id="nav-panel1">
        <h3>Settings</h3>
        <p>Configure your application settings here.</p>
      </div>
      <div role="tabpanel" id="nav-panel2" hidden>
        <h3>Profile</h3>
        <p>Manage your user profile information.</p>
      </div>
      <div role="tabpanel" id="nav-panel3" hidden>
        <h3>Security</h3>
        <p>Update your security preferences.</p>
      </div>
    </module-tabgroup>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-tabgroup");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-tabgroup") as HTMLElement &
      ModuleTabgroupProps;

    await expect(el.selected).toBe("nav-panel1");

    await userEvent.click(canvas.getByRole("tab", { name: "Profile" }));
    await expect(el.selected).toBe("nav-panel2");

    await userEvent.click(canvas.getByRole("tab", { name: "Security" }));
    await expect(el.selected).toBe("nav-panel3");
  },
};

// ⚠️ Custom render: pre-selects the second tab (aria-selected/tabindex) to test initial selection from markup
export const SecondTabInitial: Story = {
  render: () => html`
    <module-tabgroup>
      <div role="tablist">
        <button type="button" role="tab" aria-controls="init-panel1" aria-selected="false" tabindex="-1">Home</button>
        <button type="button" role="tab" aria-controls="init-panel2" aria-selected="true" tabindex="0">About</button>
        <button type="button" role="tab" aria-controls="init-panel3" aria-selected="false" tabindex="-1">Contact</button>
      </div>
      <div role="tabpanel" id="init-panel1" hidden>Home content</div>
      <div role="tabpanel" id="init-panel2">About content</div>
      <div role="tabpanel" id="init-panel3" hidden>Contact content</div>
    </module-tabgroup>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-tabgroup");
    const el = canvasElement.querySelector("module-tabgroup") as HTMLElement &
      ModuleTabgroupProps;

    await expect(el.selected).toBe("init-panel2");
  },
};

// ⚠️ Custom render: uses First/Second/Third tabs to test keyboard roving tabindex
export const KeyboardNavigation: Story = {
  render: () => html`
    <module-tabgroup>
      <div role="tablist">
        <button type="button" role="tab" aria-controls="key-panel1" aria-selected="true" tabindex="0">First</button>
        <button type="button" role="tab" aria-controls="key-panel2" aria-selected="false" tabindex="-1">Second</button>
        <button type="button" role="tab" aria-controls="key-panel3" aria-selected="false" tabindex="-1">Third</button>
      </div>
      <div role="tabpanel" id="key-panel1">First panel content</div>
      <div role="tabpanel" id="key-panel2" hidden>Second panel content</div>
      <div role="tabpanel" id="key-panel3" hidden>Third panel content</div>
    </module-tabgroup>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-tabgroup");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-tabgroup") as HTMLElement &
      ModuleTabgroupProps;
    const firstTab = canvas.getByRole("tab", { name: "First" });

    await expect(el.selected).toBe("key-panel1");

    firstTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.selected).toBe("key-panel2");

    await userEvent.keyboard("{ArrowRight}");
    await expect(el.selected).toBe("key-panel3");

    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.selected).toBe("key-panel2");
  },
};

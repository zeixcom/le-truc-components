import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import { type FormRadiogroupArgs, Radiogroup } from "./form-radiogroup.html";
import "./form-radiogroup.ts";
import "./form-radiogroup.css";
import type { FormAssociatedElement } from "@zeix/le-truc";
import type { FormRadiogroupProps } from "./form-radiogroup.ts";

const meta: Meta<FormRadiogroupArgs> = {
  title: "Form/Radiogroup",
  render: Radiogroup,
  argTypes: {
    value: {
      control: "text",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
    variant: {
      control: { type: "select" },
      options: ["none", "radio-group", "split-button"],
      table: { category: "Classes" },
    },
  },
};
export default meta;
type Story = StoryObj<FormRadiogroupArgs>;

export const Default: Story = {
  args: {
    value: "system",
    variant: "radio-group",
  },
};

// ⚠️ Custom render: shows all three variants side-by-side, each with different option sets and legends
export const AllVariants: Story = {
  render: () => html`
    <p>Default (native):</p>
    <form-radiogroup>
      <fieldset>
        <legend>Gender</legend>
        <label>
          <input type="radio" name="gender" value="female" />
          <span>Female</span>
        </label>
        <label>
          <input type="radio" name="gender" value="male" />
          <span>Male</span>
        </label>
        <label class="selected">
          <input type="radio" name="gender" value="other" checked />
          <span>Other</span>
        </label>
      </fieldset>
    </form-radiogroup>
    <p>Radio group:</p>
    <form-radiogroup class="radio-group">
      <fieldset>
        <legend>Theme</legend>
        <label>
          <input type="radio" class="visually-hidden" name="theme2" value="light" />
          <span>Light</span>
        </label>
        <label class="selected">
          <input type="radio" class="visually-hidden" name="theme2" value="dark" checked />
          <span>Dark</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="theme2" value="system" />
          <span>System</span>
        </label>
      </fieldset>
    </form-radiogroup>
    <p>Split button:</p>
    <form-radiogroup class="split-button">
      <fieldset>
        <legend class="visually-hidden">Filter</legend>
        <label class="selected">
          <input type="radio" class="visually-hidden" name="filter2" value="all" checked />
          <span>All</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="filter2" value="active" />
          <span>Active</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="filter2" value="done" />
          <span>Done</span>
        </label>
      </fieldset>
    </form-radiogroup>
  `,
};

export const DynamicUpdates: Story = {
  args: { value: "light", variant: "radio-group" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-radiogroup");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-radiogroup") as HTMLElement &
      FormAssociatedElement &
      FormRadiogroupProps;

    await expect(el.value).toBe("light");

    await userEvent.click(canvas.getByLabelText("Dark"));
    await expect(el.value).toBe("dark");

    await userEvent.click(canvas.getByLabelText("System"));
    await expect(el.value).toBe("system");
  },
};

export const KeyboardNavigation: Story = {
  args: { value: "light", variant: "radio-group" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-radiogroup");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-radiogroup") as HTMLElement &
      FormAssociatedElement &
      FormRadiogroupProps;
    const light = canvas.getByLabelText("Light") as HTMLInputElement;
    const dark = canvas.getByLabelText("Dark") as HTMLInputElement;
    const system = canvas.getByLabelText("System") as HTMLInputElement;

    // tabIndex reflects the selected radio, independent of DOM focus.
    await expect(light.tabIndex).toBe(0);
    await expect(dark.tabIndex).toBe(-1);

    light.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(document.activeElement).toBe(dark);
    // Moving focus alone (no click/Enter) does not change the value or tabIndex yet.
    await expect(el.value).toBe("light");
    await expect(light.tabIndex).toBe(0);
    await expect(dark.tabIndex).toBe(-1);

    await userEvent.keyboard("{ArrowDown}");
    await expect(document.activeElement).toBe(system);

    // Wraps around past the last option.
    await userEvent.keyboard("{ArrowRight}");
    await expect(document.activeElement).toBe(light);

    await userEvent.keyboard("{ArrowLeft}");
    await expect(document.activeElement).toBe(system);

    await userEvent.keyboard("{ArrowUp}");
    await expect(document.activeElement).toBe(dark);

    await userEvent.keyboard("{Home}");
    await expect(document.activeElement).toBe(light);

    await userEvent.keyboard("{End}");
    await expect(document.activeElement).toBe(system);

    // Enter activates the focused (but not yet selected) radio.
    await userEvent.keyboard("{Enter}");
    await expect(el.value).toBe("system");
    await expect(system.checked).toBe(true);

    // Unrelated key: no change.
    await userEvent.keyboard("a");
    await expect(el.value).toBe("system");
  },
};

export const ClickFocusTracking: Story = {
  args: { value: "light", variant: "radio-group" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-radiogroup");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-radiogroup") as HTMLElement &
      FormAssociatedElement &
      FormRadiogroupProps;
    const dark = canvas.getByLabelText("Dark") as HTMLInputElement;

    await userEvent.click(dark);
    await expect(el.value).toBe("dark");

    // Roving tabindex follows the click, so a subsequent Enter re-activates
    // the same (already selected) radio without moving focus first.
    await userEvent.keyboard("{Enter}");
    await expect(el.value).toBe("dark");
  },
};

export const PropertyChanges: Story = {
  args: { value: "light", variant: "split-button" },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-radiogroup");
    const el = canvasElement.querySelector("form-radiogroup") as HTMLElement &
      FormAssociatedElement &
      FormRadiogroupProps;
    const labels = el.querySelectorAll("label");

    await expect(el.value).toBe("light");
    await expect(labels[0]).toHaveClass("selected");

    el.value = "system";
    await expect(el.value).toBe("system");
    await expect(labels[2]).toHaveClass("selected");
    await expect(labels[0]).not.toHaveClass("selected");
  },
};

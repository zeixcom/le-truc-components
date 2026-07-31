import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./form-radiogroup.ts";
import "./form-radiogroup.css";
import type { FormAssociatedElement } from "@zeix/le-truc";
import type { FormRadiogroupProps } from "./form-radiogroup.ts";

type FormRadiogroupArgs = {
  value: string;
  variant: "none" | "radio-group" | "split-button";
};

const render = ({ value, variant }: FormRadiogroupArgs) => html`
  <form-radiogroup class=${variant !== "none" ? variant : nothing}>
    <fieldset>
      <legend>Theme</legend>
      <label class=${value === "light" ? "selected" : nothing}>
        <input type="radio" class="visually-hidden" name="theme" value="light" ?checked=${value === "light"} />
        <span>Light</span>
      </label>
      <label class=${value === "dark" ? "selected" : nothing}>
        <input type="radio" class="visually-hidden" name="theme" value="dark" ?checked=${value === "dark"} />
        <span>Dark</span>
      </label>
      <label class=${value === "system" ? "selected" : nothing}>
        <input type="radio" class="visually-hidden" name="theme" value="system" ?checked=${value === "system"} />
        <span>System</span>
      </label>
    </fieldset>
  </form-radiogroup>
`;

const meta: Meta<FormRadiogroupArgs> = {
  title: "Form/Radiogroup",
  render,
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

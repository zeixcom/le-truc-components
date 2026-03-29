import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "./form-radiogroup.ts";
import "./form-radiogroup.css";
import type { Component } from "@zeix/le-truc";
import type { FormRadiogroupProps } from "./form-radiogroup.ts";

type FormRadiogroupArgs = {
  value: string;
  variant: "none" | "radio-group" | "split-button";
};

const meta: Meta<FormRadiogroupArgs> = {
  title: "Form/Radiogroup",
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
  render: ({ value, variant }) => {
    const cls = variant !== "none" ? ` class="${variant}"` : "";
    return `
      <form-radiogroup${cls}>
        <fieldset>
          <legend>Theme</legend>
          <label${value === "light" ? ' class="selected"' : ""}>
            <input type="radio" class="visually-hidden" name="theme" value="light"${value === "light" ? " checked" : ""} />
            <span>Light</span>
          </label>
          <label${value === "dark" ? ' class="selected"' : ""}>
            <input type="radio" class="visually-hidden" name="theme" value="dark"${value === "dark" ? " checked" : ""} />
            <span>Dark</span>
          </label>
          <label${value === "system" ? ' class="selected"' : ""}>
            <input type="radio" class="visually-hidden" name="theme" value="system"${value === "system" ? " checked" : ""} />
            <span>System</span>
          </label>
        </fieldset>
      </form-radiogroup>
    `;
  },
};

export const AllVariants: Story = {
  render: () => `
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
  render: () => `
    <form-radiogroup class="radio-group">
      <fieldset>
        <legend>Size</legend>
        <label class="selected">
          <input type="radio" class="visually-hidden" name="size" value="small" checked />
          <span>Small</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="size" value="medium" />
          <span>Medium</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="size" value="large" />
          <span>Large</span>
        </label>
      </fieldset>
    </form-radiogroup>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-radiogroup");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "form-radiogroup",
    ) as Component<FormRadiogroupProps>;

    await expect(el.value).toBe("small");

    await userEvent.click(canvas.getByLabelText("Medium"));
    await expect(el.value).toBe("medium");

    await userEvent.click(canvas.getByLabelText("Large"));
    await expect(el.value).toBe("large");
  },
};

export const PropertyChanges: Story = {
  render: () => `
    <form-radiogroup class="split-button">
      <fieldset>
        <legend class="visually-hidden">Priority</legend>
        <label class="selected">
          <input type="radio" class="visually-hidden" name="priority" value="low" checked />
          <span>Low</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="priority" value="medium" />
          <span>Medium</span>
        </label>
        <label>
          <input type="radio" class="visually-hidden" name="priority" value="high" />
          <span>High</span>
        </label>
      </fieldset>
    </form-radiogroup>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-radiogroup");
    const el = canvasElement.querySelector(
      "form-radiogroup",
    ) as Component<FormRadiogroupProps>;
    const labels = el.querySelectorAll("label");

    await expect(el.value).toBe("low");
    await expect(labels[0]).toHaveClass("selected");

    el.value = "high";
    await expect(el.value).toBe("high");
    await expect(labels[2]).toHaveClass("selected");
    await expect(labels[0]).not.toHaveClass("selected");
  },
};

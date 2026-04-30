import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./module-splitview.ts";
import "./module-splitview.css";
import type { ModuleSplitviewProps } from "./module-splitview.ts";

type ModuleSplitviewArgs = {
  split: number;
  orientation: "horizontal" | "vertical";
};

const render = ({ split, orientation }: ModuleSplitviewArgs) => html`
  <module-splitview
    split=${split}
    orientation=${orientation !== "horizontal" ? orientation : nothing}
    style="height: 200px;"
  >
    <div class="panel">
      <p>${orientation === "vertical" ? "Top" : "Left"} panel</p>
      <p>Drag the handle or focus it and use arrow keys to resize.</p>
    </div>
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation=${orientation}
      aria-valuenow=${Math.round(split * 100)}
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    <div class="panel">
      <p>${orientation === "vertical" ? "Bottom" : "Right"} panel</p>
      <p>The proportions are kept when the container is resized.</p>
    </div>
  </module-splitview>
`;

const meta: Meta<ModuleSplitviewArgs> = {
  title: "Module/Splitview",
  render,
  argTypes: {
    split: {
      control: { type: "range", min: 0.1, max: 0.9, step: 0.05 },
      table: {
        defaultValue: { summary: "0.5" },
        category: "Reactive Properties",
      },
    },
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      table: {
        defaultValue: { summary: "horizontal" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleSplitviewArgs>;

export const Default: Story = {
  args: {
    split: 0.5,
    orientation: "horizontal",
  },
};

export const PresetSplit: Story = {
  args: {
    split: 0.3,
    orientation: "horizontal",
  },
};

export const Vertical: Story = {
  args: {
    split: 0.5,
    orientation: "vertical",
  },
};

export const KeyboardResize: Story = {
  args: {
    split: 0.5,
    orientation: "horizontal",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-splitview");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-splitview",
    ) as HTMLElement & ModuleSplitviewProps;
    const divider = canvas.getByRole("separator");

    await expect(el.split).toBeCloseTo(0.5, 1);

    divider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.split).toBeCloseTo(0.55, 1);

    await userEvent.keyboard("{End}");
    await expect(el.split).toBeCloseTo(0.9, 1);

    await userEvent.keyboard("{Home}");
    await expect(el.split).toBeCloseTo(0.1, 1);
  },
};

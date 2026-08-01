import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent } from "storybook/test";
import { Calctable } from "./module-calctable.html";
import "./module-calctable.ts";
import "./module-calctable.css";

const meta: Meta = {
  title: "Module/Calctable",
  render: Calctable,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-calctable");
    // biome-ignore lint/style/noNonNullAssertion: rendered unconditionally by the story; if missing, the assertions below fail loudly.
    const container = canvasElement.querySelector("[data-container]")!;

    // Two pre-rendered rows are adopted into the reactive list on mount.
    const rows = container.querySelectorAll("tr[data-key]");
    await expect(rows.length).toBe(2);

    // Filling the entry row (description, amount, price/unit) + commit
    // (change) creates a third row.
    // biome-ignore lint/style/noNonNullAssertion: the entry row is always rendered; if missing, userEvent.type below throws with a clear error.
    const entryDesc = container.querySelector<HTMLInputElement>(
      "tr[data-unreconciled] input.description",
    )!;
    // biome-ignore lint/style/noNonNullAssertion: the entry row is always rendered; if missing, userEvent.type below throws with a clear error.
    const entryAmount = container.querySelector<HTMLInputElement>(
      "tr[data-unreconciled] input.amount",
    )!;
    // biome-ignore lint/style/noNonNullAssertion: the entry row is always rendered; if missing, userEvent.type below throws with a clear error.
    const entryPrice = container.querySelector<HTMLInputElement>(
      "tr[data-unreconciled] input.price-per-unit",
    )!;
    await userEvent.type(entryDesc, "Sprocket");
    await userEvent.type(entryAmount, "2");
    await userEvent.type(entryPrice, "4.99");
    await userEvent.tab();
    await expect(container.querySelectorAll("tr[data-key]").length).toBe(3);
  },
};

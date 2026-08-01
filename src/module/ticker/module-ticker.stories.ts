import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import { ModuleTicker } from "./module-ticker.html";
import "./module-ticker.ts";
import "./module-ticker.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";

const meta: Meta = {
  title: "Module/Ticker",
  render: ModuleTicker,
};
export default meta;
type Story = StoryObj;

// Skipped under Vitest: the component runs a 10 ms setInterval that never
// resolves a deterministic assertion. Stays live in the Storybook UI.
export const Default: Story = {
  tags: ["skip"],
};

// Exercises pause/resume and row insertion without asserting on the
// random-walk price ticks themselves, so it stays deterministic despite
// the 10 ms interval running in the background.
export const Interactions: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-ticker");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("module-ticker") as HTMLElement & {
      running: boolean;
      fraction: number;
    };

    await expect(el.running).toBe(true);

    await userEvent.click(canvas.getByText("⏸️ Pause"));
    await expect(el.running).toBe(false);
    await expect(canvas.getByText("▶️ Resume")).toBeInTheDocument();

    await userEvent.click(canvas.getByText("▶️ Resume"));
    await expect(el.running).toBe(true);
    await expect(canvas.getByText("⏸️ Pause")).toBeInTheDocument();

    const rowsBefore = canvasElement.querySelectorAll("tr[data-symbol]").length;
    await userEvent.click(canvas.getByText("➕ Add 100 rows"));
    const rowsAfter = canvasElement.querySelectorAll("tr[data-symbol]").length;
    await expect(rowsAfter).toBe(rowsBefore + 100);

    // Newly added rows are materialized directly (not virtualized) and
    // priced from the template clone.
    const newRow = canvasElement.querySelector(
      `tbody:nth-of-type(2) tr[data-symbol]`,
    );
    await expect(newRow?.querySelector(".price")).toHaveTextContent(/\d/);
  },
};

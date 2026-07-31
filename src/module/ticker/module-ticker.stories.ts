import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./module-ticker.ts";
import "./module-ticker.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";

// The same seed symbols/prices used in the upstream demo page. The component
// reads these server-rendered rows to build its reactive list, so the markup
// must be present before connect.
const SYMBOLS: Array<[string, number]> = [
  ["AAPL", 189.3],
  ["MSFT", 417.5],
  ["NVDA", 875.4],
  ["AMZN", 183.2],
  ["GOOGL", 162.6],
  ["META", 494.8],
  ["TSLA", 238.1],
  ["BRK.B", 406.7],
  ["JPM", 197.4],
  ["V", 277.9],
];

const render = () => html`
  <module-ticker fraction="0.1">
    <div class="controls">
      <basic-button class="toggle">
        <button type="button">
          <span class="label">⏸️ Pause</span>
        </button>
      </basic-button>
      <basic-button class="add-rows">
        <button type="button">➕ Add 100 rows</button>
      </basic-button>
    </div>
    <table>
      <thead>
        <tr>
          <th scope="col">Symbol</th>
          <th scope="col">Price (USD)</th>
          <th scope="col">Change</th>
          <th scope="col">Volume</th>
        </tr>
      </thead>
      <tbody>
        ${SYMBOLS.map(
          ([symbol, price]) => html`
            <tr data-symbol=${symbol} data-direction="flat">
              <th scope="row">${symbol}</th>
              <td class="price">${price.toFixed(2)}</td>
              <td class="change">+0.00%</td>
              <td class="volume">0</td>
            </tr>
          `,
        )}
      </tbody>
    </table>
    <template>
      <tr data-symbol="" data-direction="flat">
        <th scope="row"></th>
        <td class="price">0.00</td>
        <td class="change">+0.00%</td>
        <td class="volume">0</td>
      </tr>
    </template>
  </module-ticker>
`;

const meta: Meta = {
  title: "Module/Ticker",
  render,
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

    const rowsBefore =
      canvasElement.querySelectorAll("tr[data-symbol]").length;
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

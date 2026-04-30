import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./module-ticker.ts";
import "./module-ticker.css";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import type { ModuleTickerProps } from "./module-ticker.ts";

const tickerTemplate = html`
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
        <tr data-symbol="AAPL" data-direction="flat">
          <th scope="row">AAPL</th>
          <td class="price">189.30</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="MSFT" data-direction="flat">
          <th scope="row">MSFT</th>
          <td class="price">417.50</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="NVDA" data-direction="flat">
          <th scope="row">NVDA</th>
          <td class="price">875.40</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="AMZN" data-direction="flat">
          <th scope="row">AMZN</th>
          <td class="price">183.20</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="GOOGL" data-direction="flat">
          <th scope="row">GOOGL</th>
          <td class="price">162.60</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="META" data-direction="flat">
          <th scope="row">META</th>
          <td class="price">494.80</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="TSLA" data-direction="flat">
          <th scope="row">TSLA</th>
          <td class="price">238.10</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="BRK.B" data-direction="flat">
          <th scope="row">BRK.B</th>
          <td class="price">406.70</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="JPM" data-direction="flat">
          <th scope="row">JPM</th>
          <td class="price">197.40</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
        <tr data-symbol="V" data-direction="flat">
          <th scope="row">V</th>
          <td class="price">277.90</td>
          <td class="change">+0.00%</td>
          <td class="volume">0</td>
        </tr>
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
  render: () => tickerTemplate,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const PauseResume: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-ticker");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-ticker",
    ) as HTMLElement & ModuleTickerProps;

    await expect(el.running).toBe(true);

    const pauseButton = canvas.getByRole("button", { name: /Pause/i });
    await userEvent.click(pauseButton);
    await expect(el.running).toBe(false);

    const resumeButton = canvas.getByRole("button", { name: /Resume/i });
    await userEvent.click(resumeButton);
    await expect(el.running).toBe(true);
  },
};

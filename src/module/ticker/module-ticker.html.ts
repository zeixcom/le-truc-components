import { html } from "lit";

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

// Exported so other components' stories can embed a ticker instance via
// ${ModuleTicker()} instead of duplicating its markup.
export const ModuleTicker = () => html`
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

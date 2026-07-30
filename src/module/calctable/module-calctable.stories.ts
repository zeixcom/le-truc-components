import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent } from "storybook/test";
import "./module-calctable.ts";
import "./module-calctable.css";

const render = () => html`
  <module-calctable options='{"style":"currency","currency":"CHF"}'>
    <table>
      <thead>
        <tr>
          <th class="description" scope="col">Description</th>
          <th class="amount" scope="col">Amount</th>
          <th class="price-per-unit" scope="col">Price/Unit</th>
          <th class="price" scope="col">Price</th>
        </tr>
      </thead>
      <tbody data-container>
        <tr data-key="item1">
          <td class="description">
            <input
              type="text"
              class="description"
              value="Widget"
              aria-label="Description"
            />
          </td>
          <td class="amount">
            <input
              type="number"
              class="amount"
              min="0"
              max="100"
              step="1"
              inputmode="numeric"
              value="3"
              aria-label="Amount"
            />
          </td>
          <td class="price-per-unit">
            <input
              type="number"
              class="price-per-unit"
              min="0"
              max="1000"
              step="0.01"
              inputmode="decimal"
              value="12.50"
              aria-label="Price per unit"
            />
          </td>
          <td class="price">CHF 37.50</td>
        </tr>
        <tr data-key="item2">
          <td class="description">
            <input
              type="text"
              class="description"
              value="Gadget"
              aria-label="Description"
            />
          </td>
          <td class="amount">
            <input
              type="number"
              class="amount"
              min="0"
              max="100"
              step="1"
              inputmode="numeric"
              value="5"
              aria-label="Amount"
            />
          </td>
          <td class="price-per-unit">
            <input
              type="number"
              class="price-per-unit"
              min="0"
              max="1000"
              step="0.01"
              inputmode="decimal"
              value="8.00"
              aria-label="Price per unit"
            />
          </td>
          <td class="price">CHF 40.00</td>
        </tr>
        <tr data-unreconciled>
          <td class="description">
            <input
              type="text"
              class="description"
              placeholder="New item"
              aria-label="Description"
            />
          </td>
          <td class="amount">
            <input
              type="number"
              class="amount"
              min="0"
              max="100"
              step="1"
              inputmode="numeric"
              aria-label="Amount"
            />
          </td>
          <td class="price-per-unit">
            <input
              type="number"
              class="price-per-unit"
              min="0"
              max="1000"
              step="0.01"
              inputmode="decimal"
              aria-label="Price per unit"
            />
          </td>
          <td class="price"></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td class="description">Total</td>
          <td class="amount">8</td>
          <td class="price-per-unit"></td>
          <td class="price">CHF 77.50</td>
        </tr>
      </tfoot>
    </table>
    <template>
      <tr>
        <td class="description">
          <input
            type="text"
            class="description"
            aria-label="Description"
          />
        </td>
        <td class="amount">
          <input
            type="number"
            class="amount"
            min="0"
            max="100"
            step="1"
            inputmode="numeric"
            aria-label="Amount"
          />
        </td>
        <td class="price-per-unit">
          <input
            type="number"
            class="price-per-unit"
            min="0"
            max="1000"
            step="0.01"
            inputmode="decimal"
            aria-label="Price per unit"
          />
        </td>
        <td class="price"></td>
      </tr>
    </template>
  </module-calctable>
`;

const meta: Meta = {
  title: "Module/Calctable",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-calctable");
    const container = canvasElement.querySelector("[data-container]")!;

    // Two pre-rendered rows are adopted into the reactive list on mount.
    const rows = container.querySelectorAll("tr[data-key]");
    await expect(rows.length).toBe(2);

    // Filling the entry row (description, amount, price/unit) + commit
    // (change) creates a third row.
    const entryDesc = container.querySelector<HTMLInputElement>(
      'tr[data-unreconciled] input.description',
    )!;
    const entryAmount = container.querySelector<HTMLInputElement>(
      'tr[data-unreconciled] input.amount',
    )!;
    const entryPrice = container.querySelector<HTMLInputElement>(
      'tr[data-unreconciled] input.price-per-unit',
    )!;
    await userEvent.type(entryDesc, "Sprocket");
    await userEvent.type(entryAmount, "2");
    await userEvent.type(entryPrice, "4.99");
    await userEvent.tab();
    await expect(
      container.querySelectorAll("tr[data-key]").length,
    ).toBe(3);
  },
};

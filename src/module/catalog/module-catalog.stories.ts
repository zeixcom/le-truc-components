import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../form/spinbutton/form-spinbutton.ts";
import "../../form/spinbutton/form-spinbutton.css";
import "./module-catalog.ts";
import "./module-catalog.css";
import type { BasicButtonProps } from "../../basic/button/basic-button.ts";

const meta: Meta = {
  title: "Module/Catalog",
};
export default meta;
type Story = StoryObj;

const spinbuttonItem = (name: string, label: string, max: number) => html`
  <li>
    <p>${label}</p>
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement" hidden>
        −
      </button>
      <input
        type="number"
        class="value"
        name=${name}
        value="0"
        min="0"
        max=${max}
        readonly
        disabled
        hidden
        aria-label="Quantity"
      />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero">Add to Cart</span>
        <span class="other" hidden>+</span>
      </button>
    </form-spinbutton>
  </li>
`;

export const Default: Story = {
  render: () => html`
    <module-catalog>
      <header>
        <p>Shop</p>
        <basic-button disabled>
          <button type="button" disabled>
            <span class="label">🛒 Shopping Cart</span>
            <span class="badge"></span>
          </button>
        </basic-button>
      </header>
      <ul>
        ${spinbuttonItem("product1", "Product 1", 10)}
        ${spinbuttonItem("product2", "Product 2", 5)}
        ${spinbuttonItem("product3", "Product 3", 20)}
      </ul>
    </module-catalog>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-catalog");
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const button = canvasElement.querySelector("basic-button") as HTMLElement &
      BasicButtonProps;

    // Cart button starts disabled (total = 0)
    await expect(button.disabled).toBe(true);

    // At value 0 each spinbutton's increment button reads "Add to Cart" (its
    // `.zero` label), not "Increment" — the spinbutton re-labels it while the
    // value is zero. There is one per product.
    const addToCartButtons = canvas.getAllByLabelText("Add to Cart");

    // Add product 1
    const product1 = addToCartButtons[0];
    if (product1) {
      await userEvent.click(product1);

      await expect(button.disabled).toBe(false);
      await expect(button.badge).toBe("1");
    }

    // Add two more items from product 2
    const product2 = addToCartButtons[1];
    if (product2) {
      await userEvent.click(product2);
      await userEvent.click(product2);

      await expect(button.badge).toBe("3");
    }
  },
};

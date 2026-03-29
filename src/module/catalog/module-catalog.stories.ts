import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, within } from "storybook/test";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../form/spinbutton/form-spinbutton.ts";
import "../../form/spinbutton/form-spinbutton.css";
import "./module-catalog.ts";
import "./module-catalog.css";
import type { Component } from "@zeix/le-truc";
import type { BasicButtonProps } from "../../basic/button/basic-button.ts";

const meta: Meta = {
  title: "Module/Catalog",
};
export default meta;
type Story = StoryObj;

const spinbuttonItem = (name: string, label: string, max: number) => `
  <li>
    <p>${label}</p>
    <form-spinbutton>
      <button type="button" class="decrement" aria-label="Decrement" hidden>−</button>
      <input type="number" class="value" name="${name}" value="0" min="0" max="${max}" readonly disabled hidden />
      <button type="button" class="increment" aria-label="Increment">
        <span class="zero">Add to Cart</span>
        <span class="other" hidden>+</span>
      </button>
    </form-spinbutton>
  </li>
`;

export const Default: Story = {
  render: () => `
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
    const button = canvasElement.querySelector(
      "basic-button",
    ) as Component<BasicButtonProps>;

    // Cart button starts disabled (total = 0)
    await expect(button.disabled).toBe(true);

    // Add product 1
    const increments = canvas.getAllByLabelText("Increment");
    const product1 = increments[0];
    if (product1) {
      await userEvent.click(product1);

      await expect(button.disabled).toBe(false);
      await expect(button.badge).toBe("1");
    }

    // Add two more items from product 2
    const product2 = increments[1];
    if (product2) {
      await userEvent.click(product2);
      await userEvent.click(product2);

      await expect(button.badge).toBe("3");
    }
  },
};

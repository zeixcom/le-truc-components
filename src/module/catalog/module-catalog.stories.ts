import type { Meta, StoryObj } from "@storybook/web-components";
import type { FormAssociatedElement } from "@zeix/le-truc";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ModuleCatalog } from "./module-catalog.html";
import "../../basic/button/basic-button.ts";
import "../../basic/button/basic-button.css";
import "../../form/spinbutton/form-spinbutton.ts";
import "../../form/spinbutton/form-spinbutton.css";
import "./module-catalog.ts";
import "./module-catalog.css";
import type { BasicButtonProps } from "../../basic/button/basic-button.ts";
import type { FormSpinbuttonProps } from "../../form/spinbutton/form-spinbutton.ts";

const meta: Meta = {
  title: "Module/Catalog",
  render: ModuleCatalog,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
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

// Demonstrates validity composition (ADR 0020): checkout re-checks stock and
// may lower a spinbutton's `max` (an internally-derived `rangeOverflow`)
// while separately explaining why via `setCustomValidity()` (an
// externally-set `customError`) — both coexist on the same `internals`.
export const AvailabilityCheckOnCheckout: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-catalog");
    await customElements.whenDefined("form-spinbutton");
    const canvas = within(canvasElement);
    const spinbuttons = canvasElement.querySelectorAll("form-spinbutton");
    const product2 = spinbuttons[1] as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;
    const product3 = spinbuttons[2] as HTMLElement &
      FormAssociatedElement &
      FormSpinbuttonProps;

    const addToCartButtons = canvas.getAllByLabelText("Add to Cart");
    // Product 2: max 5 on load, mocked backend reduces it to 2.
    await userEvent.click(addToCartButtons[1] as HTMLElement);
    const product2Increment = within(product2).getByLabelText("Increment");
    await userEvent.click(product2Increment);
    await userEvent.click(product2Increment); // value: 3, above the post-check max of 2

    // Product 3: mocked backend reports it sold out (max: 0).
    await userEvent.click(addToCartButtons[2] as HTMLElement); // value: 1

    const button = canvasElement.querySelector("basic-button button");
    await userEvent.click(button as HTMLElement);

    // Wait for the mocked round trip (300ms) to resolve for all three.
    await waitFor(() =>
      expect(product3.querySelector(".error")).toHaveTextContent(
        "No longer available",
      ),
    );

    // Both the internally-derived rangeOverflow and the externally-set
    // customError are true at once, on the same `internals`.
    await expect(product2.max).toBe(2);
    await expect(product2.validity.rangeOverflow).toBe(true);
    await expect(product2.validity.customError).toBe(true);
    await expect(product2.validationMessage).toBe("Only 2 left in stock");

    await expect(product3.max).toBe(0);
    await expect(product3.disabled).toBe(true);
    const fieldset = product3.querySelector("fieldset");
    await expect(fieldset).toHaveAttribute("disabled");
  },
};

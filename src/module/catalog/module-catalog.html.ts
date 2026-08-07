import { html } from "lit";
import { FormSpinbutton } from "../../form/spinbutton/form-spinbutton.html";

const spinbuttonItem = (
  productId: string,
  name: string,
  label: string,
  max: number,
) => html`
  <li>
    <p>${label}</p>
    ${FormSpinbutton({
      name,
      dataProduct: productId,
      value: 0,
      min: 0,
      max,
      ariaLabel: "Quantity",
      zeroLabel: "Add to Cart",
    })}
  </li>
`;

// Exported so other components' stories can embed a catalog instance via
// ${ModuleCatalog()} instead of duplicating its markup.
export const ModuleCatalog = () => html`
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
      ${spinbuttonItem("product-1", "product1", "Product 1", 10)}
      ${spinbuttonItem("product-2", "product2", "Product 2", 5)}
      ${spinbuttonItem("product-3", "product3", "Product 3", 20)}
    </ul>
  </module-catalog>
`;

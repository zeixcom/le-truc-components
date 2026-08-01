import { html } from "lit";

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

// Exported so other components' stories can embed a catalog instance via
// ${Catalog()} instead of duplicating its markup.
export const Catalog = () => html`
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
`;

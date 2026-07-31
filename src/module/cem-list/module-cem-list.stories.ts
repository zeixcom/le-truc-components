import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./module-cem-list.ts";
import "./module-cem-list.css";
import "../../card/collapsible/card-collapsible.ts";
import "../../card/collapsible/card-collapsible.css";
import "../../form/textbox/form-textbox.ts";
import "../../form/textbox/form-textbox.css";

// In the docs site this markup is generated server-side from a
// custom-elements.json. Here it is hand-authored to represent the same shape:
// a filter <form-textbox> plus one <card-collapsible> per declaration.
const render = () => html`
  <module-cem-list>
    <form-textbox name="filter">
      <label for="module-cem-list-demo-filter-input">Filter</label>
      <div class="input">
        <input
          type="text"
          id="module-cem-list-demo-filter-input"
          autocomplete="off"
          placeholder="Filter by name, tag, or description"
        />
        <button type="button" class="clear" aria-label="Clear filter" hidden>
          ✕
        </button>
      </div>
    </form-textbox>

    <card-collapsible>
      <details>
        <summary>
          <span class="header">
            <strong class="name">BasicHello</strong>
            <code>basic-hello</code>
          </span>
          <span class="description">
            A hello-world component that greets a name entered via an input
            field. Use it as a starting point for learning
            <code>@zeix/le-truc</code>.
          </span>
        </summary>
        <div class="content">
          <p class="demo-link"><a href="#">View live demo →</a></p>
        </div>
      </details>
    </card-collapsible>

    <card-collapsible>
      <details>
        <summary>
          <span class="header">
            <strong class="name">FormCheckbox</strong>
            <code>form-checkbox</code>
          </span>
          <span class="description">
            A styled checkbox component that syncs its state with a native
            checkbox input. Form participation is via
            <code>ElementInternals</code>.
          </span>
        </summary>
        <div class="content">
          <p class="demo-link"><a href="#">View live demo →</a></p>
        </div>
      </details>
    </card-collapsible>
  </module-cem-list>
`;

const meta: Meta = {
  title: "Module/Cem List",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-cem-list");
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText(
      "Filter by name, tag, or description",
    );
    const cards = canvasElement.querySelectorAll("card-collapsible");
    await expect(cards.length).toBe(2);

    // Typing a term present only in the second card hides the first.
    await userEvent.type(input, "checkbox");
    await expect(cards[0]?.hidden).toBe(true);
    await expect(cards[1]?.hidden).toBe(false);
  },
};

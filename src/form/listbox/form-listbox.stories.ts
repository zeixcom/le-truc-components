import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect, userEvent, waitFor, within } from "storybook/test";
import "../../card/callout/card-callout.css";
import "../../module/scrollarea/module-scrollarea.ts";
import "../../module/scrollarea/module-scrollarea.css";
import "./form-listbox.ts";
import "./form-listbox.css";
import type { FormListboxProps } from "./form-listbox.ts";

type FormListboxArgs = {
  value: string;
  filter: string;
  src: string;
};

const render = ({ value }: FormListboxArgs) => html`
  <form>
    <form-listbox id="colors" value=${value || nothing}>
      <input type="hidden" name="color" />
      <div role="listbox" aria-label="Colors">
        <button
          type="button"
          role="option"
          tabindex="-1"
          value="red"
          aria-selected=${value === "red" ? "true" : nothing}
        >
          Red
        </button>
        <button
          type="button"
          role="option"
          tabindex="-1"
          value="green"
          aria-selected=${value === "green" ? "true" : nothing}
        >
          Green
        </button>
        <button
          type="button"
          role="option"
          tabindex="-1"
          value="blue"
          aria-selected=${value === "blue" ? "true" : nothing}
        >
          Blue
        </button>
        <button
          type="button"
          role="option"
          tabindex="-1"
          value="yellow"
          aria-selected=${value === "yellow" ? "true" : nothing}
        >
          Yellow
        </button>
        <button
          type="button"
          role="option"
          tabindex="-1"
          value="purple"
          aria-selected=${value === "purple" ? "true" : nothing}
        >
          Purple
        </button>
      </div>
    </form-listbox>
  </form>
`;

const meta: Meta<FormListboxArgs> = {
  title: "Form/Listbox",
  render,
  argTypes: {
    value: {
      control: "text",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
    filter: {
      control: "text",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
    src: {
      control: "text",
      description:
        "URL to a JSON file with options. Accepts an array <code>[{value, label}]</code> or grouped object <code>{key: {label, items}}</code>.",
      table: {
        defaultValue: { summary: "''" },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<FormListboxArgs>;

export const Default: Story = {
  args: {
    value: "",
    filter: "",
  },
};

// ⚠️ Custom render: includes a filter input and clear button inside the listbox for testing filter functionality
export const WithFilter: Story = {
  render: () => html`
    <form>
      <form-listbox id="fruits">
        <input type="hidden" name="fruit" />
        <label for="fruits-filter" class="visually-hidden">Filter fruits</label>
        <div class="input">
          <input
            type="text"
            id="fruits-filter"
            class="filter"
            placeholder="Filter fruits"
          />
          <button type="button" class="clear" aria-label="Clear filter">
            ✕
          </button>
        </div>
        <div role="listbox" aria-label="Fruits">
          <button type="button" role="option" tabindex="-1" value="apple">
            Apple
          </button>
          <button type="button" role="option" tabindex="-1" value="banana">
            Banana
          </button>
          <button type="button" role="option" tabindex="-1" value="cherry">
            Cherry
          </button>
          <button type="button" role="option" tabindex="-1" value="mango">
            Mango
          </button>
          <button type="button" role="option" tabindex="-1" value="orange">
            Orange
          </button>
          <button type="button" role="option" tabindex="-1" value="strawberry">
            Strawberry
          </button>
        </div>
      </form-listbox>
    </form>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-listbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-listbox") as HTMLElement &
      FormListboxProps;
    const filterInput = canvas.getByPlaceholderText("Filter fruits");

    await expect(el.options.length).toBe(6);

    await userEvent.type(filterInput, "an");
    await expect(el.filter).toBe("an");
    // banana, mango, orange match "an"
    await expect(el.options.length).toBe(3);

    await userEvent.clear(filterInput);
    await expect(el.options.length).toBe(6);
  },
};

// ⚠️ Custom render: uses grouped options structure (role="group") with two categories
export const WithGroups: Story = {
  render: () => html`
    <form>
      <form-listbox id="grouped-fruits">
        <input type="hidden" name="fruit" />
        <div role="listbox" aria-label="Fruits by category">
          <div role="group" aria-labelledby="group-citrus">
            <div role="presentation" id="group-citrus">Citrus</div>
            <button type="button" role="option" tabindex="-1" value="orange">
              Orange
            </button>
            <button type="button" role="option" tabindex="-1" value="lemon">
              Lemon
            </button>
            <button type="button" role="option" tabindex="-1" value="lime">
              Lime
            </button>
          </div>
          <div role="group" aria-labelledby="group-berries">
            <div role="presentation" id="group-berries">Berries</div>
            <button
              type="button"
              role="option"
              tabindex="-1"
              value="strawberry"
            >
              Strawberry
            </button>
            <button type="button" role="option" tabindex="-1" value="blueberry">
              Blueberry
            </button>
          </div>
        </div>
      </form-listbox>
    </form>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-listbox");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-listbox") as HTMLElement &
      FormListboxProps;

    await expect(el.value).toBe("");

    await userEvent.click(canvas.getByRole("option", { name: "Lemon" }));
    await expect(el.value).toBe("lemon");
  },
};

// ⚠️ Custom render: uses src attribute with a loading/error state card-callout and an empty listbox container
export const WithSrc: Story = {
  args: {
    src: "/mocks/listbox/simple-options.json",
  },
  render: ({ src }) => html`
    <form>
      <form-listbox id="remote-options" src=${src || nothing}>
        <input type="hidden" name="option" />
        <card-callout>
          <p class="loading" role="status">Loading...</p>
          <p class="error" role="alert" aria-live="assertive" hidden></p>
        </card-callout>
        <div role="listbox" aria-label="Options"></div>
      </form-listbox>
    </form>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-listbox");
    const el = canvasElement.querySelector("form-listbox") as HTMLElement &
      FormListboxProps;

    await waitFor(() => expect(el.options.length).toBeGreaterThan(0));
    await expect(el.value).toBe("");

    const option = el.options[0];
    if (option) {
      await userEvent.click(option);
      await expect(el.value).toBe(option.value);
    }
  },
};

// ⚠️ Custom render: uses language options with a pre-selected item (aria-selected="true", tabindex="0") to test initial selection state
export const Selection: Story = {
  render: () => html`
    <form>
      <form-listbox id="langs">
        <input type="hidden" name="language" />
        <div role="listbox" aria-label="Languages">
          <button type="button" role="option" tabindex="-1" value="en">
            English
          </button>
          <button
            type="button"
            role="option"
            tabindex="0"
            value="fr"
            aria-selected="true"
          >
            French
          </button>
          <button type="button" role="option" tabindex="-1" value="de">
            German
          </button>
        </div>
      </form-listbox>
    </form>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-listbox");
    const el = canvasElement.querySelector("form-listbox") as HTMLElement &
      FormListboxProps;

    await expect(el.value).toBe("fr");

    el.value = "de";
    const options = el.querySelectorAll<HTMLButtonElement>('[role="option"]');
    await expect(options[2]?.ariaSelected).toBe("true");
    await expect(options[1]?.ariaSelected).toBe("false");
  },
};

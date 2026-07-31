import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, within } from "storybook/test";
import "./card-colorscale.ts";
import "./card-colorscale.css";

const scale = (size: string) => html`
  <card-colorscale class=${size} color="oklch(.48 .23 263)">
    <ol role="presentation">
      <li class="lighten80"></li>
      <li class="lighten60"></li>
      <li class="lighten40"></li>
      <li class="lighten20"></li>
      <li class="base">
        <span class="label">
          <strong>Blue</strong>
          <small></small>
        </span>
      </li>
      <li class="darken20"></li>
      <li class="darken40"></li>
      <li class="darken60"></li>
      <li class="darken80"></li>
    </ol>
  </card-colorscale>
`;

const render = () => html`
  ${scale("tiny")}
  <hr />
  ${scale("small")}
  <hr />
  ${scale("medium")}
  <hr />
  ${scale("large")}
`;

const meta: Meta = {
  title: "Card/Colorscale",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-colorscale");
    const canvas = within(canvasElement);
    // The hex label is computed for each swatch.
    await expect(canvas.getAllByText(/^#[0-9a-f]{6}$/i).length).toBeGreaterThan(
      0,
    );
  },
};

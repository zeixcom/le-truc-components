import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./card-blogmeta.ts";
import "./card-blogmeta.css";

const avatar =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='32' fill='%23667'/></svg>";

const render = () => html`
  <card-blogmeta>
    <span>
      <img src=${avatar} alt="Avatar of Esther Brunner" />
      <span>Esther Brunner</span>
    </span>
    <time class="published" datetime="2026-03-09">2026-03-09</time>
    <span>5 min read</span>
  </card-blogmeta>

  <br />

  <card-blogmeta>
    <span>
      <img src=${avatar} alt="Avatar of Esther Brunner" />
      <span>Esther Brunner</span>
    </span>
    <span>
      <time class="published" datetime="2026-04-04">2026-04-04</time>
      <span class="modified">
        · updated on <time datetime="2026-04-08">2026-04-08</time>
      </span>
    </span>
    <span>7 min read</span>
  </card-blogmeta>
`;

const meta: Meta = {
  title: "Card/Blogmeta",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithModifiedDate: Story = {};

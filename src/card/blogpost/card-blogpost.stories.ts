import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./card-blogpost.css";
import "../blogmeta/card-blogmeta.ts";
import "../blogmeta/card-blogmeta.css";

const avatar =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='32' fill='%23667'/></svg>";

const render = () => html`
  <card-blogpost>
    <h2>
      <a href="#">🎉 Introducing Le Truc</a>
    </h2>
    <card-blogmeta>
      <img src=${avatar} alt="Avatar of Esther Brunner" />
      <span>Esther Brunner</span>
      <time class="published" datetime="2026-03-09">2026-03-09</time>
      <span>5 min read</span>
    </card-blogmeta>
    <p>
      A reactive custom elements library that brings fine-grained reactivity
      directly to the web platform.
    </p>
  </card-blogpost>
`;

const meta: Meta = {
  title: "Card/Blogpost",
  render,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

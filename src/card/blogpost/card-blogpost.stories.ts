import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./card-blogpost.css";
import "../blogmeta/card-blogmeta.ts";
import "../blogmeta/card-blogmeta.css";

const meta: Meta = {
  title: "Card/Blogpost",
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <card-blogpost>
      <h2>
        <a href="#">🎉 Introducing Le Truc</a>
      </h2>
      <card-blogmeta>
        <span>
          <img
            src="./assets/img/avatar/esther-brunner.jpg"
            alt="Avatar of Esther Brunner"
          />
          <span>Esther Brunner</span>
        </span>
        <time class="published" datetime="2026-03-09">2026-03-09</time>
        <span>5 min read</span>
      </card-blogmeta>
      <p>
        A reactive custom elements library that brings fine-grained reactivity
        directly to the web platform.
      </p>
    </card-blogpost>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <card-blogpost>
      <h2>
        <a href="#">🎉 Introducing Le Truc</a>
      </h2>
      <card-blogmeta>
        <span>
          <img
            src="./assets/img/avatar/esther-brunner.jpg"
            alt="Avatar of Esther Brunner"
          />
          <span>Esther Brunner</span>
        </span>
        <time class="published" datetime="2026-03-09">2026-03-09</time>
        <span>5 min read</span>
      </card-blogmeta>
      <p>
        A reactive custom elements library that brings fine-grained reactivity
        directly to the web platform.
      </p>
    </card-blogpost>
    <card-blogpost>
      <h2>
        <a href="#">Understanding OKLCH Colors</a>
      </h2>
      <card-blogmeta>
        <span>
          <img
            src="./assets/img/avatar/esther-brunner.jpg"
            alt="Avatar of Esther Brunner"
          />
          <span>Esther Brunner</span>
        </span>
        <span>
          <time class="published" datetime="2026-04-04">2026-04-04</time>
          <span class="modified">
            · updated on
            <time datetime="2026-04-08">2026-04-08</time>
          </span>
        </span>
        <span>7 min read</span>
      </card-blogmeta>
      <p>
        A deep dive into the OKLCH color space and how it enables perceptually
        uniform color palettes for design systems.
      </p>
    </card-blogpost>
  `,
};

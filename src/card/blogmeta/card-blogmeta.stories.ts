import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect } from "storybook/test";
import "./card-blogmeta.ts";
import "./card-blogmeta.css";

const meta: Meta = {
  title: "Card/Blogmeta",
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
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
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-blogmeta");
    const time = canvasElement.querySelector("time.published");
    await expect(time).not.toHaveTextContent("2026-03-09");
    await expect(time?.textContent?.trim().length).toBeGreaterThan(0);
  },
};

export const WithModifiedDate: Story = {
  render: () => html`
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
          · updated on <time datetime="2026-04-08">2026-04-08</time>
        </span>
      </span>
      <span>7 min read</span>
    </card-blogmeta>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-blogmeta");
    const published = canvasElement.querySelector("time.published");
    const modified = canvasElement.querySelector(".modified time");
    const modifiedSpan = canvasElement.querySelector("span.modified");
    await expect(published).not.toHaveTextContent("2026-04-04");
    await expect(modified).not.toHaveTextContent("2026-04-08");
    await expect(modifiedSpan).toBeInTheDocument();
  },
};

export const InvalidModifiedDate: Story = {
  render: () => html`
    <card-blogmeta>
      <span>
        <span>Esther Brunner</span>
      </span>
      <span>
        <time class="published" datetime="2026-04-04">2026-04-04</time>
        <span class="modified">
          · updated on <time datetime="not-a-date">not-a-date</time>
        </span>
      </span>
      <span>3 min read</span>
    </card-blogmeta>
  `,
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-blogmeta");
    const modifiedSpan = canvasElement.querySelector("span.modified");
    await expect(modifiedSpan).not.toBeInTheDocument();
  },
};

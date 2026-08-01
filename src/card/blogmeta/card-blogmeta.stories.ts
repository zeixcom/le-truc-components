import type { Meta, StoryObj } from "@storybook/web-components";
import { expect } from "storybook/test";
import { timestamp } from "../../_common/storyArgs";
import {
  blogmetaArgTypes,
  CardBlogmeta,
  type CardBlogmetaArgs,
} from "./card-blogmeta.html";
import "./card-blogmeta.ts";
import "./card-blogmeta.css";

const meta: Meta<CardBlogmetaArgs> = {
  title: "Card/Blogmeta",
  render: CardBlogmeta,
  argTypes: blogmetaArgTypes,
};
export default meta;
type Story = StoryObj<CardBlogmetaArgs>;

export const Default: Story = {
  args: {
    author: "Esther Brunner",
    avatarSrc:
      "https://zeixcom.github.io/le-truc/assets/img/avatar/esther-brunner.jpg",
    datePublished: timestamp("2026-03-09"),
    dateModified: 0,
    timeRequired: 5,
    lang: "",
  },
};

export const WithModifiedDate: Story = {
  args: {
    author: "Esther Brunner",
    avatarSrc:
      "https://zeixcom.github.io/le-truc/assets/img/avatar/esther-brunner.jpg",
    datePublished: timestamp("2026-04-04"),
    dateModified: timestamp("2026-04-08"),
    timeRequired: 7,
    lang: "",
  },
};

// No avatarSrc: card-blogmeta falls back to a stylized inline SVG placeholder avatar
export const WithoutAvatar: Story = {
  args: {
    author: "Anonymous Contributor",
    avatarSrc: "",
    datePublished: timestamp("2026-05-12"),
    dateModified: 0,
    timeRequired: 3,
    lang: "",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-blogmeta");
    const el = canvasElement.querySelector("card-blogmeta");
    await expect(el?.querySelector(".author img")).not.toBeInTheDocument();
    await expect(el?.querySelector(".author svg.avatar")).toBeInTheDocument();
  },
};

// lang="de": dates are formatted per German locale conventions (e.g. "9. März 2026")
export const GermanLocale: Story = {
  args: {
    author: "Esther Brunner",
    avatarSrc:
      "https://zeixcom.github.io/le-truc/assets/img/avatar/esther-brunner.jpg",
    datePublished: timestamp("2026-03-09"),
    dateModified: 0,
    timeRequired: 5,
    lang: "de",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("card-blogmeta");
    const el = canvasElement.querySelector("card-blogmeta");
    const expected = new Intl.DateTimeFormat("de", {
      dateStyle: "long",
    }).format(new Date(2026, 2, 9));
    await expect(el?.querySelector("time.published")).toHaveTextContent(
      expected,
    );
  },
};

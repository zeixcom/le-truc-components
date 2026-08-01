import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { timestamp } from "../../_common/storyArgs";
import {
  Blogmeta,
  blogmetaArgTypes,
  type CardBlogmetaArgs,
} from "../blogmeta/card-blogmeta.stories";
import "./card-blogpost.css";
import "../blogmeta/card-blogmeta.ts";
import "../blogmeta/card-blogmeta.css";

type CardBlogpostArgs = CardBlogmetaArgs & {
  title: string;
  href: string;
  excerpt: string;
};

const render = ({
  title,
  href,
  excerpt,
  ...blogmetaArgs
}: CardBlogpostArgs) => html`
  <card-blogpost itemscope itemtype="https://schema.org/BlogPosting">
    <h2>
      <a href=${href} itemprop="url"
        ><span itemprop="headline">${title}</span></a
      >
    </h2>
    ${Blogmeta(blogmetaArgs)}
    <p itemprop="description">${excerpt}</p>
  </card-blogpost>
`;

const meta: Meta<CardBlogpostArgs> = {
  title: "Card/Blogpost",
  render,
  argTypes: {
    title: {
      control: "text",
      description:
        "Post title, annotated with schema.org <code>headline</code>",
      table: { category: "Content" },
    },
    href: {
      control: "text",
      description: "Link target, annotated with schema.org <code>url</code>",
      table: { category: "Content" },
    },
    excerpt: {
      control: "text",
      description:
        "Teaser text, annotated with schema.org <code>description</code>",
      table: { category: "Content" },
    },
    ...blogmetaArgTypes,
  },
};
export default meta;
type Story = StoryObj<CardBlogpostArgs>;

export const Default: Story = {
  args: {
    title: "🎉 Introducing Le Truc",
    href: "#",
    excerpt:
      "A reactive custom elements library that brings fine-grained reactivity directly to the web platform.",
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
    title: "📦 Le Truc 1.0 Released",
    href: "#",
    excerpt:
      "The first stable release brings a smaller bundle size and a redesigned reactive core.",
    author: "Esther Brunner",
    avatarSrc:
      "https://zeixcom.github.io/le-truc/assets/img/avatar/esther-brunner.jpg",
    datePublished: timestamp("2026-04-04"),
    dateModified: timestamp("2026-04-08"),
    timeRequired: 7,
    lang: "",
  },
};

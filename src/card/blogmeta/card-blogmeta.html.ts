import type { Meta } from "@storybook/web-components";
import { html, nothing } from "lit";
import { toISODate } from "../../_common/storyArgs";

export type CardBlogmetaArgs = {
  author: string;
  avatarSrc: string;
  datePublished: number;
  dateModified: number;
  timeRequired: number;
  lang: string;
};

// Exported so card-blogpost.html.ts can embed a blogmeta instance via
// ${Blogmeta(args)} instead of duplicating its markup.
export const Blogmeta = ({
  author,
  avatarSrc,
  datePublished,
  dateModified,
  timeRequired,
  lang,
}: CardBlogmetaArgs) => html`
  <card-blogmeta lang=${lang || nothing}>
    <span
      class="author"
      itemprop="author"
      itemscope
      itemtype="https://schema.org/Person"
    >
      ${
        avatarSrc
          ? html`<img class="avatar" src=${avatarSrc} alt="Avatar of ${author}" />`
          : nothing
      }
      <span itemprop="name">${author}</span>
    </span>
    <span>
	    <time
	      class="published"
	      itemprop="datePublished"
	      datetime=${toISODate(datePublished)}
	    ></time>
	    ${
        dateModified
          ? html`
	          <span class="modified">
	            · updated on
	            <time
	              itemprop="dateModified"
	              datetime=${toISODate(dateModified)}
	            ></time>
	          </span>
	        `
          : nothing
      }
    </span>
    <span class="read-time">
      <meta itemprop="timeRequired" content="PT${timeRequired}M" />${timeRequired}
      min read
    </span>
  </card-blogmeta>
`;

// Exported so card-blogpost.html.ts can fold these into its own
// argTypes when it embeds Blogmeta(args).
export const blogmetaArgTypes = {
  author: {
    control: "text",
    description: "Author name, annotated with schema.org <code>Person</code>",
    table: { category: "Content" },
  },
  avatarSrc: {
    control: "text",
    description:
      "Author avatar image URL — when empty, a stylized placeholder avatar is shown instead",
    table: { category: "Content" },
  },
  datePublished: {
    control: "date",
    description:
      "Publication date, annotated with schema.org <code>datePublished</code>",
    table: { category: "Content" },
  },
  dateModified: {
    control: "date",
    description:
      "Optional modification date, annotated with schema.org <code>dateModified</code> — leave unset (0) to omit",
    table: { category: "Content" },
  },
  timeRequired: {
    control: "number",
    description:
      "Estimated reading time in minutes, annotated with schema.org <code>timeRequired</code> as an ISO 8601 duration",
    table: { category: "Content" },
  },
  lang: {
    control: "text",
    description:
      "Optional BCP 47 language tag — demonstrates that dates are formatted according to the (possibly inherited) locale",
    table: { category: "Attributes" },
  },
} satisfies Meta<CardBlogmetaArgs>["argTypes"];

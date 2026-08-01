import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { expect } from "storybook/test";
import "./card-blogmeta.ts";
import "./card-blogmeta.css";

type CardBlogmetaArgs = {
  author: string;
  avatarSrc: string;
  datePublished: number;
  dateModified: number;
  timeRequired: number;
  lang: string;
};

// Storybook's date control hands back a timestamp (local midnight of the
// picked day); convert to the YYYY-MM-DD string the datetime attribute needs.
const toISODate = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Converts an ISO date literal to the local timestamp toISODate round-trips,
// so story args can still be written as readable YYYY-MM-DD strings.
const timestamp = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return new Date(year, month - 1, day).getTime();
};

const render = ({
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

const meta: Meta<CardBlogmetaArgs> = {
  title: "Card/Blogmeta",
  render,
  argTypes: {
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
  },
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

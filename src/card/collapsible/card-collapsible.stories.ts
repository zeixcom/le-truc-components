import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./card-collapsible.ts";
import "./card-collapsible.css";

type CardCollapsibleArgs = {
  description: string;
  content: string;
  open: boolean;
};

// Exported so other components' stories can embed a collapsible instance via
// ${Collapsible(args)} instead of duplicating its markup.
export const Collapsible = ({
  description,
  content,
  open,
}: CardCollapsibleArgs) => html`
  <card-collapsible>
    <details ?open=${open}>
      <summary>
        <span class="description">${description}</span>
      </summary>
      <div class="content">
        <p>${content}</p>
      </div>
    </details>
  </card-collapsible>
`;

const meta: Meta<CardCollapsibleArgs> = {
  title: "Card/Collapsible",
  render: Collapsible,
  // Collapsible is exported for reuse by other stories files, not a story itself.
  excludeStories: /^Collapsible$/,
  argTypes: {
    description: {
      control: "text",
      description: "Summary text — truncated with an ellipsis while collapsed",
      table: { category: "Content" },
    },
    content: {
      control: "text",
      description: "Body content, only visible once the card is expanded",
      table: { category: "Content" },
    },
    open: {
      control: "boolean",
      description: "Whether the card starts expanded",
      table: { category: "Attributes" },
    },
  },
};
export default meta;
type Story = StoryObj<CardCollapsibleArgs>;

export const Default: Story = {
  args: {
    description:
      "Click to expand and read the rest of this card — the summary text is truncated with an ellipsis while collapsed.",
    content:
      "This is the full body content of the card. It is only visible once the card is expanded, and the summary text above wraps normally instead of being truncated.",
    open: false,
  },
};

export const OpenByDefault: Story = {
  args: {
    description: "This card starts open.",
    content:
      "Set the open attribute on the descendant <details> element to render it expanded by default.",
    open: true,
  },
};

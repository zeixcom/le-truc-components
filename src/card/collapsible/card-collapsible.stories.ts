import type { Meta, StoryObj } from "@storybook/web-components";
import {
  CardCollapsible,
  type CardCollapsibleArgs,
} from "./card-collapsible.html";
import "./card-collapsible.ts";
import "./card-collapsible.css";

const meta: Meta<CardCollapsibleArgs> = {
  title: "Card/Collapsible",
  render: CardCollapsible,
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
      description:
        "Whether the card is expanded — reflects the descendant &lt;details&gt; element's <code>open</code> state as a reactive property",
      table: { category: "Reactive Properties" },
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

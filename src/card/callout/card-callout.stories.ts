import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { CardCallout, type CardCalloutArgs } from "./card-callout.html";
import "./card-callout.css";

const meta: Meta<CardCalloutArgs> = {
  title: "Card/Callout",
  render: CardCallout,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "tip", "caution", "danger", "note"],
      table: { category: "Classes" },
    },
    content: {
      control: "text",
      table: { category: "Content" },
    },
  },
};
export default meta;
type Story = StoryObj<CardCalloutArgs>;

export const Default: Story = {
  args: {
    variant: "info",
    content: "This is an informational message.",
  },
};

// ⚠️ Custom render: shows all five variants side-by-side with representative messages
export const AllVariants: Story = {
  render: () => html`
    ${CardCallout({ variant: "info", content: "This is an informational message." })}
    ${CardCallout({ variant: "tip", content: "Remember to hydrate while coding!" })}
    ${CardCallout({ variant: "caution", content: "Be careful with this operation." })}
    ${CardCallout({ variant: "danger", content: "This action is irreversible!" })}
    ${CardCallout({ variant: "note", content: "This is just a side note." })}
  `,
};

// ⚠️ Custom render: uses multi-paragraph rich HTML content that cannot be expressed as a plain text arg
export const WithRichContent: Story = {
  render: () =>
    CardCallout({
      variant: "tip",
      content: html`
        <p>You can include <strong>rich content</strong> inside a callout.</p>
        <p>Multiple paragraphs work too — the last child's bottom margin is removed automatically.</p>
      `,
    }),
};

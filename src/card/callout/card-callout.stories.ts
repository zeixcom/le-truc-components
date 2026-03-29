import type { Meta, StoryObj } from "@storybook/web-components";
import "./card-callout.css";

type CardCalloutArgs = {
  variant: "info" | "tip" | "caution" | "danger" | "note";
  content: string;
};

const meta: Meta<CardCalloutArgs> = {
  title: "Card/Callout",
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
  render: ({ variant, content }) => `
    <card-callout${variant !== "info" ? ` class="${variant}"` : ""}>${content}</card-callout>
  `,
};

export const AllVariants: Story = {
  render: () => `
    <card-callout>This is an informational message.</card-callout>
    <card-callout class="tip">Remember to hydrate while coding!</card-callout>
    <card-callout class="caution">Be careful with this operation.</card-callout>
    <card-callout class="danger">This action is irreversible!</card-callout>
    <card-callout class="note">This is just a side note.</card-callout>
  `,
};

export const WithRichContent: Story = {
  render: () => `
    <card-callout class="tip">
      <p>You can include <strong>rich content</strong> inside a callout.</p>
      <p>Multiple paragraphs work too — the last child's bottom margin is removed automatically.</p>
    </card-callout>
  `,
};

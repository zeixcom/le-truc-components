import { html, nothing, type TemplateResult } from "lit";

export type CardCalloutArgs = {
  variant: "info" | "tip" | "caution" | "danger" | "note";
  content: string | TemplateResult;
};

// Exported so other components' stories can embed a callout instance via
// ${CardCallout(args)} instead of duplicating its markup.
export const CardCallout = ({ variant, content }: CardCalloutArgs) => html`
  <card-callout class=${variant !== "info" ? variant : nothing}>${content}</card-callout>
`;

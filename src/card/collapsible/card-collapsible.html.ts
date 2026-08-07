import { html, type TemplateResult } from "lit";

export type CardCollapsibleArgs = {
  description: string | TemplateResult;
  content: string | TemplateResult;
  open: boolean;
};

// Exported so other components' stories can embed a collapsible instance via
// ${CardCollapsible(args)} instead of duplicating its markup.
export const CardCollapsible = ({
  description,
  content,
  open,
}: CardCollapsibleArgs) => html`
  <card-collapsible>
    <details ?open=${open}>
      <summary>
        ${
          typeof description === "string"
            ? html`<span class="description">${description}</span>`
            : description
        }
      </summary>
      <div class="content">
        ${typeof content === "string" ? html`<p>${content}</p>` : content}
      </div>
    </details>
  </card-collapsible>
`;

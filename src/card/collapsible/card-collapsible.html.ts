import { html } from "lit";

export type CardCollapsibleArgs = {
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

import { html } from "lit";

export type FormInplaceEditArgs = {
  name: string;
  value: string;
};

// Exported so other components' stories can embed an inplace-edit instance
// via ${InplaceEdit(args)} instead of duplicating its markup.
export const InplaceEdit = ({ name, value }: FormInplaceEditArgs) => html`
  <form-inplace-edit name=${name}>
    <span class="text">${value}</span>
    <button type="button" aria-label="Edit">✎</button>
  </form-inplace-edit>
`;

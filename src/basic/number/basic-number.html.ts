import { html, nothing } from "lit";

export type BasicNumberArgs = {
  value: number;
  options: string;
  lang: string;
  caption: string;
  wrapperLang: string;
};

// Exported so other components' stories can embed a number instance via
// ${NumberEl(args)} instead of duplicating its markup.
export const NumberEl = ({
  value,
  options,
  lang,
}: Pick<BasicNumberArgs, "value" | "options" | "lang">) => html`
  <basic-number
    value=${value}
    options=${options || nothing}
    lang=${lang || nothing}
  ></basic-number>
`;

// Wraps NumberEl with a demo caption and a lang-carrying <p> ancestor —
// used as this component's own story render, not meant for embedding.
export const NumberDemo = ({
  caption,
  wrapperLang,
  ...args
}: BasicNumberArgs) => html`
  <p lang=${wrapperLang || nothing}>
    ${caption ? html`${caption}:<br />` : nothing}${NumberEl(args)}
  </p>
`;

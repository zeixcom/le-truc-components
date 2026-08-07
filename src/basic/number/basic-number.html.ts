import { html, nothing } from "lit";

export type BasicNumberArgs = {
  value?: number;
  options?: string;
  lang?: string;
  // Selector class, e.g. one of the lightness/chroma/hue steps module-colorinfo queries.
  class?: string;
  caption: string;
  wrapperLang: string;
};

// Exported so other components' stories can embed a number instance via
// ${BasicNumber(args)} instead of duplicating its markup.
export const BasicNumber = ({
  value,
  options,
  lang,
  class: cls,
}: Pick<BasicNumberArgs, "value" | "options" | "lang" | "class">) => html`
  <basic-number
    class=${cls || nothing}
    value=${value ?? nothing}
    options=${options || nothing}
    lang=${lang || nothing}
  ></basic-number>
`;

// Wraps BasicNumber with a demo caption and a lang-carrying <p> ancestor —
// used as this component's own story render, not meant for embedding.
export const NumberDemo = ({
  caption,
  wrapperLang,
  ...args
}: BasicNumberArgs) => html`
  <p lang=${wrapperLang || nothing}>
    ${caption ? html`${caption}:<br />` : nothing}${BasicNumber(args)}
  </p>
`;

import { html, nothing } from "lit";

export type BasicPluralizeArgs = {
  count: number;
  lang: string;
  ordinal: boolean;
};

export const BasicPluralize = ({
  count,
  ordinal,
  lang,
}: BasicPluralizeArgs) => html`
  <p>Remaining tasks:</p>
  <basic-pluralize count=${count} ?ordinal=${ordinal} lang=${lang || nothing}>
    <p class="none">Well done, all done!</p>
    <p class="some">
      <span class="count"></span>
      task<span class="other">s</span>
      remaining
    </p>
  </basic-pluralize>
`;

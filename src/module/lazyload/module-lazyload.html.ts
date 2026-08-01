import { html, nothing } from "lit";

export type ModuleLazyloadArgs = {
  src: string;
  "allow-scripts": boolean;
};

// Exported so other components' stories can embed a lazyload instance via
// ${ModuleLazyload(args)} instead of duplicating its markup.
export const ModuleLazyload = ({
  src,
  "allow-scripts": allowScripts,
}: ModuleLazyloadArgs) => html`
  <module-lazyload src=${src || nothing} ?allow-scripts=${allowScripts}>
    <card-callout>
      <p class="loading" role="status">Loading...</p>
      <p class="error" role="alert" aria-live="assertive" hidden></p>
    </card-callout>
    <div class="content" hidden></div>
  </module-lazyload>
`;

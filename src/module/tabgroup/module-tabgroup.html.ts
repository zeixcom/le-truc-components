import { html } from "lit";

// Exported so other components' stories can embed a tabgroup instance via
// ${Tabgroup()} instead of duplicating its markup.
export const Tabgroup = () => html`
  <module-tabgroup>
    <div role="tablist">
      <button type="button" role="tab" aria-controls="panel1" aria-selected="true" tabindex="0">Tab 1</button>
      <button type="button" role="tab" aria-controls="panel2" aria-selected="false" tabindex="-1">Tab 2</button>
      <button type="button" role="tab" aria-controls="panel3" aria-selected="false" tabindex="-1">Tab 3</button>
    </div>
    <div role="tabpanel" id="panel1">Tab 1 content</div>
    <div role="tabpanel" id="panel2" hidden>Tab 2 content</div>
    <div role="tabpanel" id="panel3" hidden>Tab 3 content</div>
  </module-tabgroup>
`;

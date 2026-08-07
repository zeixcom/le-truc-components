import { html } from "lit";
import { ModuleScrollarea } from "../scrollarea/module-scrollarea.html";

// Exported so other components' stories can embed a splitview instance via
// ${ModuleSplitview()} instead of duplicating its markup.
export const ModuleSplitview = () => html`
  <!-- Horizontal split (default) -->
  <module-splitview id="horizontal-splitview">
    ${ModuleScrollarea({
      style: "",
      content: html`
        <div>
          <p>Left panel</p>
          <p>Drag the handle or focus it and use arrow keys to resize.</p>
        </div>
      `,
    })}
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation="horizontal"
      aria-valuenow="50"
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    ${ModuleScrollarea({
      style: "",
      content: html`
        <div>
          <p>Right panel</p>
          <p>The proportions are kept when the container is resized.</p>
        </div>
      `,
    })}
  </module-splitview>

  <hr />

  <!-- Pre-set split position via attribute -->
  <module-splitview id="preset-splitview" split="0.3">
    ${ModuleScrollarea({
      style: "",
      content: html`
        <div>
          <p>Narrow panel (30%)</p>
        </div>
      `,
    })}
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation="horizontal"
      aria-valuenow="30"
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    ${ModuleScrollarea({
      style: "",
      content: html`
        <div>
          <p>Wide panel (70%)</p>
        </div>
      `,
    })}
  </module-splitview>

  <hr />

  <!-- Vertical split -->
  <module-splitview id="vertical-splitview" orientation="vertical">
    ${ModuleScrollarea({
      style: "",
      content: html`
        <div>
          <p>Top panel</p>
        </div>
      `,
    })}
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation="vertical"
      aria-valuenow="50"
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    ${ModuleScrollarea({
      style: "",
      content: html`
        <div>
          <p>Bottom panel</p>
        </div>
      `,
    })}
  </module-splitview>
`;

import { html } from "lit";

// In the docs site this markup is generated server-side from a
// custom-elements.json. Here it is hand-authored to represent the same shape:
// a filter <form-textbox> plus one <card-collapsible> per declaration.
//
// Exported so other components' stories can embed a cem-list instance via
// ${ModuleCemList()} instead of duplicating its markup.
export const ModuleCemList = () => html`
  <module-cem-list>
    <form-textbox name="filter">
      <label for="module-cem-list-demo-filter-input">Filter</label>
      <div class="input">
        <input
          type="text"
          id="module-cem-list-demo-filter-input"
          autocomplete="off"
          placeholder="Filter by name, tag, or description"
        />
        <button type="button" class="clear" aria-label="Clear filter" hidden>
          ✕
        </button>
      </div>
    </form-textbox>

    <card-collapsible>
      <details>
        <summary>
          <span class="header">
            <strong class="name">BasicHello</strong>
            <code>basic-hello</code>
          </span>
          <span class="description">
            A hello-world component that greets a name entered via an input
            field. Use it as a starting point for learning
            <code>@zeix/le-truc</code>.
          </span>
        </summary>
        <div class="content">
          <p class="demo-link"><a href="#">View live demo →</a></p>
        </div>
      </details>
    </card-collapsible>

    <card-collapsible>
      <details>
        <summary>
          <span class="header">
            <strong class="name">FormCheckbox</strong>
            <code>form-checkbox</code>
          </span>
          <span class="description">
            A styled checkbox component that syncs its state with a native
            checkbox input. Form participation is via
            <code>ElementInternals</code>.
          </span>
        </summary>
        <div class="content">
          <p class="demo-link"><a href="#">View live demo →</a></p>
        </div>
      </details>
    </card-collapsible>
  </module-cem-list>
`;

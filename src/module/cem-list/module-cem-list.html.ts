import { html } from "lit";
import { CardCollapsible } from "../../card/collapsible/card-collapsible.html";
import { FormTextbox } from "../../form/textbox/form-textbox.html";

// In the docs site this markup is generated server-side from a
// custom-elements.json. Here it is hand-authored to represent the same shape:
// a filter <form-textbox> plus one <card-collapsible> per declaration.
//
// Exported so other components' stories can embed a cem-list instance via
// ${ModuleCemList()} instead of duplicating its markup.
export const ModuleCemList = () => html`
  <module-cem-list>
    ${FormTextbox({
      id: "module-cem-list-demo-filter-input",
      label: "Filter",
      hostName: "filter",
      name: "",
      autocomplete: "off",
      placeholder: "Filter by name, tag, or description",
      required: false,
      clearable: true,
      clearLabel: "Clear filter",
      showError: false,
    })}

    ${CardCollapsible({
      open: false,
      description: html`
        <span class="header">
          <strong class="name">BasicHello</strong>
          <code>basic-hello</code>
        </span>
        <span class="description">
          A hello-world component that greets a name entered via an input
          field. Use it as a starting point for learning
          <code>@zeix/le-truc</code>.
        </span>
      `,
      content: html`<p class="demo-link"><a href="#">View live demo →</a></p>`,
    })}

    ${CardCollapsible({
      open: false,
      description: html`
        <span class="header">
          <strong class="name">FormCheckbox</strong>
          <code>form-checkbox</code>
        </span>
        <span class="description">
          A styled checkbox component that syncs its state with a native
          checkbox input. Form participation is via
          <code>ElementInternals</code>.
        </span>
      `,
      content: html`<p class="demo-link"><a href="#">View live demo →</a></p>`,
    })}
  </module-cem-list>
`;

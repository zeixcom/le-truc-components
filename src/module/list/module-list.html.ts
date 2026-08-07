import { html } from "lit";
import { BasicButton } from "../../basic/button/basic-button.html";
import { FormTextbox } from "../../form/textbox/form-textbox.html";

// Exported so other components' stories can embed a list instance via
// ${ModuleList()} instead of duplicating its markup.
export const ModuleList = () => html`
  <module-list>
    <form action="#">
      ${FormTextbox({
        id: "new-item-input",
        label: "New item",
        name: "new-item",
        autocomplete: "off",
        required: false,
        clearable: true,
        showError: false,
      })}
      ${BasicButton({
        label: "Add",
        disabled: true,
        variant: "constructive",
        type: "submit",
        hostClass: "submit",
      })}
    </form>
    <ul data-container></ul>
    <!-- lit-html forbids expressions inside <template>, so this clone source stays static markup -->
    <template>
      <li>
        <span><slot></slot></span>
        <basic-button class="remove">
          <button type="button" class="tertiary destructive small">Remove</button>
        </basic-button>
      </li>
    </template>
  </module-list>
`;

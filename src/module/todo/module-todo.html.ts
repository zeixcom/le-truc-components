import { html } from "lit";
import { BasicButton } from "../../basic/button/basic-button.html";
import { FormTextbox } from "../../form/textbox/form-textbox.html";

// Exported so other components' stories can embed a todo instance via
// ${ModuleTodo()} instead of duplicating its markup.
export const ModuleTodo = () => html`
  <module-todo>
    <form action="#">
      ${FormTextbox({
        id: "add-todo",
        label: "What needs to be done?",
        name: "",
        autocomplete: "",
        required: false,
        clearable: true,
        showError: false,
      })}
      ${BasicButton({
        label: "Add Todo",
        disabled: true,
        variant: "constructive",
        type: "submit",
        hostClass: "submit",
      })}
    </form>
    <span role="status" class="visually-hidden"></span>
    <ol data-container></ol>
    <!-- lit-html forbids expressions inside <template>, so this clone source stays static markup -->
    <template>
      <li>
        <button type="button" class="reorder" aria-label="Drag to reorder" aria-pressed="false">
          ≡
        </button>
        <form-checkbox class="todo">
          <input type="checkbox" class="visually-hidden" />
          <form-inplace-edit>
            <label class="label text"><slot></slot></label>
            <button type="button" aria-label="Edit">✎</button>
          </form-inplace-edit>
        </form-checkbox>
        <basic-button class="remove">
          <button type="button" class="tertiary destructive small" aria-label="Remove">
            <span class="label">✕</span>
          </button>
        </basic-button>
      </li>
    </template>
    <footer>
      <basic-pluralize>
        <p class="none">Well done, all done!</p>
        <p class="some">
          <span class="count"></span>
          <span class="one"> task</span>
          <span class="other"> tasks</span>
          remaining
        </p>
      </basic-pluralize>
      <form-radiogroup value="all" class="split-button">
        <fieldset>
          <legend class="visually-hidden">Filter</legend>
          <label class="selected">
            <input type="radio" class="visually-hidden" name="filter" value="all" checked />
            <span>All</span>
          </label>
          <label>
            <input type="radio" class="visually-hidden" name="filter" value="active" />
            <span>Active</span>
          </label>
          <label>
            <input type="radio" class="visually-hidden" name="filter" value="completed" />
            <span>Completed</span>
          </label>
        </fieldset>
      </form-radiogroup>
      ${BasicButton({
        label: "Clear Completed",
        variant: ["tertiary", "destructive"],
        hostClass: "clear-completed",
      })}
    </footer>
  </module-todo>
`;

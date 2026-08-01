import { html } from "lit";

// Exported so other components' stories can embed a list instance via
// ${ModuleList()} instead of duplicating its markup.
export const ModuleList = () => html`
  <module-list>
    <form action="#">
      <form-textbox>
        <label for="new-item-input">New item</label>
        <div class="input">
          <input type="text" id="new-item-input" name="new-item" autocomplete="off" />
          <button type="button" class="clear" aria-label="Clear input" hidden>✕</button>
        </div>
      </form-textbox>
      <basic-button class="submit">
        <button type="submit" class="constructive" disabled>
          <span class="label">Add</span>
        </button>
      </basic-button>
    </form>
    <ul data-container></ul>
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

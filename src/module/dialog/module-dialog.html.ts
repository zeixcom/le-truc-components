import { html } from "lit";

export type ModuleDialogArgs = {
  open: boolean;
};

// Exported so other components' stories can embed a dialog instance via
// ${ModuleDialog(args)} instead of duplicating its markup.
export const ModuleDialog = ({ open }: ModuleDialogArgs) => html`
  <module-dialog ?open=${open}>
    <basic-button>
      <button type="button" aria-haspopup="dialog" aria-controls="story-dialog">
        Open dialog
      </button>
    </basic-button>
    <dialog id="story-dialog" aria-labelledby="story-dialog-title">
      <header>
        <h2 id="story-dialog-title">Dialog Title</h2>
        <button type="button" class="close" aria-label="Close dialog">×</button>
      </header>
      <module-scrollarea orientation="vertical">
        <form method="dialog">
          <div class="content">
            <p>This is the dialog content. It can contain any HTML elements including forms, images, and other components.</p>
            <p>Press Escape, click the close button, or click outside the dialog to close it.</p>
          </div>
        </form>
      </module-scrollarea>
    </dialog>
  </module-dialog>
`;

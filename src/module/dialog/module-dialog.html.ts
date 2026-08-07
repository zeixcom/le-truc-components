import { html } from "lit";
import { BasicButton } from "../../basic/button/basic-button.html";
import { ModuleScrollarea } from "../scrollarea/module-scrollarea.html";

export type ModuleDialogArgs = {
  open: boolean;
};

// Exported so other components' stories can embed a dialog instance via
// ${ModuleDialog(args)} instead of duplicating its markup.
export const ModuleDialog = ({ open }: ModuleDialogArgs) => html`
  <module-dialog ?open=${open}>
    ${BasicButton({
      label: "Open dialog",
      content: "text",
      ariaHaspopup: "dialog",
      ariaControls: "story-dialog",
    })}
    <dialog id="story-dialog" aria-labelledby="story-dialog-title">
      <header>
        <h2 id="story-dialog-title">Dialog Title</h2>
        <button type="button" class="close" aria-label="Close dialog">×</button>
      </header>
      ${ModuleScrollarea({
        style: "",
        content: html`
          <form method="dialog">
            <div class="content">
              <p>This is the dialog content. It can contain any HTML elements including forms, images, and other components.</p>
              <p>Press Escape, click the close button, or click outside the dialog to close it.</p>
            </div>
          </form>
        `,
      })}
    </dialog>
  </module-dialog>
`;

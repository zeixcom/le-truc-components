import { asBoolean, bindAttribute, defineComponent } from "@zeix/le-truc";
import type { BasicButtonProps } from "../../basic/button/basic-button";
import { copyToClipboard } from "../../basic/button/copyToClipboard";

export type ModuleCodeblockProps = {
  /** Whether the codeblock is shown collapsed (with an "Expand" overlay). */
  collapsed: boolean;
};

declare global {
  interface HTMLElementTagNameMap {
    "module-codeblock": HTMLElement & ModuleCodeblockProps;
  }
}

/**
 * Displays a code sample with a collapsible overlay and a copy-to-clipboard
 * button. Expects the host to already contain highlighted markup inside a
 * `<code>` element (highlighting must happen upstream — e.g. server-side via
 * Shiki — this component never highlights on its own); the copy button
 * copies the `<code>` element's `textContent`. An optional
 * `basic-button.copy` descendant, with `copy-success`/`copy-error`
 * attributes for its feedback labels, wires up the copy action.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#module-codeblock} Interactive preview and usage examples
 */
export default defineComponent<ModuleCodeblockProps>(
  "module-codeblock",
  ({ expose, first, host, on, watch }) => {
    const code = first("code", "Needed as source container to copy from.");

    expose({ collapsed: asBoolean() });

    const overlay = first("button.overlay");
    on(overlay, "click", () => ({ collapsed: false }));

    const copy = first("basic-button.copy") as
      | (HTMLElement & BasicButtonProps)
      | null;
    if (copy)
      watch(
        () => true,
        copyToClipboard(code, copy, {
          success: copy.getAttribute("copy-success") || "Copied!",
          error:
            copy.getAttribute("copy-error") ||
            "Error trying to copy to clipboard!",
        }),
      );

    watch("collapsed", bindAttribute(host, "collapsed"));
  },
  // Not observedAttributes(['collapsed']): the watch() handler above
  // reflects the prop back onto the same host attribute via
  // bindAttribute(host, ...), so re-parsing that self-write on
  // attributeChangedCallback would be a circular update (le-truc throws
  // "[Slot] Circular delegation detected").
);

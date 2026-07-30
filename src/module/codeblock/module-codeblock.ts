import { asBoolean, bindAttribute, defineComponent } from "@zeix/le-truc";
import { copyToClipboard } from "../../basic/button/copyToClipboard";
import type { BasicButtonProps } from "../../basic/button/basic-button";

export type ModuleCodeblockProps = {
  collapsed: boolean;
};

declare global {
  interface HTMLElementTagNameMap {
    "module-codeblock": HTMLElement & ModuleCodeblockProps;
  }
}

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
);

import { bindProperty, bindText, defineComponent } from "@zeix/le-truc";

export type BasicButtonProps = {
  /** Whether the button is disabled. Synced from the native `<button>`'s own `disabled` property. */
  disabled: boolean;
  /** Visible label text. Read from `span.label`, falling back to the button's own text content. */
  label: string;
  /** Badge text shown alongside the label, e.g. a count. Read from `span.badge`. */
  badge: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-button": HTMLElement & BasicButtonProps;
  }
}

/**
 * A button wrapper that syncs `disabled` state, label text, and an optional
 * badge with the native `<button>` descendant. Use it wherever a Le Truc
 * component needs to drive a button's disabled state or text reactively;
 * for copy-to-clipboard behavior, see `module-codeblock`'s use of
 * `copyToClipboard()` on this component.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#basic-button} Interactive preview and usage examples
 */
export default defineComponent<BasicButtonProps>(
  "basic-button",
  ({ expose, first, watch }) => {
    const button = first("button", "Add a native button as descendant.");
    const label = first("span.label");
    const badge = first("span.badge");

    expose({
      disabled: button.disabled,
      label: label?.textContent ?? button.textContent ?? "",
      badge: badge?.textContent ?? "",
    });

    watch("disabled", bindProperty(button, "disabled"));
    // preserveComments: the Storybook story interpolates these elements'
    // content via lit-html expressions; the default (non-preserving) write
    // would eject Lit's ChildPart marker comments and break re-renders
    // driven by Controls.
    if (label) watch("label", bindText(label, true));
    if (badge) watch("badge", bindText(badge, true));
  },
);

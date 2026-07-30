import { bindProperty, bindText, defineComponent } from "@zeix/le-truc";

export type BasicButtonProps = {
  disabled: boolean;
  label: string;
  badge: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-button": HTMLElement & BasicButtonProps;
  }
}

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

import { bindText, defineComponent } from "@zeix/le-truc";

export type BasicHelloProps = {
  subject: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-hello": HTMLElement & BasicHelloProps;
  }
}

export default defineComponent<BasicHelloProps>(
  "basic-hello",
  ({ expose, first, on, watch }) => {
    const output = first("output", "Needed to display the subject.");
    const fallback = output.textContent || "";

    expose({ subject: fallback });

    const input = first("input", "Needed to enter the subject.");
    on(input, "input", () => ({ subject: input.value || fallback }));
    // preserveComments: the Storybook story interpolates this element's
    // content via a lit-html expression; the default (non-preserving) write
    // would eject Lit's ChildPart marker comments and break re-renders
    // driven by Controls.
    watch("subject", bindText(output, true));
  },
);

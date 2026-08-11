import { bindText, defineComponent } from "@zeix/le-truc";

export type BasicHelloProps = {
  /** Text greeted, echoed live from the `<input>`; falls back to the `<output>`'s initial text content when the input is empty. */
  subject: string;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-hello": HTMLElement & BasicHelloProps;
  }
}

/**
 * A minimal greeting example: types into an `<input>` and echoes the value
 * live into an `<output>`. Demonstrates the smallest possible `on('input')`
 * + `watch()` + `bindText()` cycle. The host must contain a native `<input>`
 * and an `<output>` element.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#basic-hello} Interactive preview and usage examples
 */
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

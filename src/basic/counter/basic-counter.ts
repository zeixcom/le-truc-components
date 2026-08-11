import { asInteger, bindText, defineComponent } from "@zeix/le-truc";

export type BasicCounterProps = {
  /** Current count value, initialized from the `<span>`'s text content and incremented on click. */
  count: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-counter": HTMLElement & BasicCounterProps;
  }
}

/**
 * A button that increments a counter on click. Demonstrates a minimal
 * `on('click')` + `watch()` + `bindText()` cycle: the host must contain a
 * `<button>` and a `<span>` whose text content is the initial integer count.
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#basic-counter} Interactive preview and usage examples
 */
export default defineComponent<BasicCounterProps>(
  "basic-counter",
  ({ expose, first, host, on, watch }) => {
    const count = first("span", "Add a span to display the count.");

    expose({ count: asInteger()(count.textContent) });

    const button = first(
      "button",
      "Add a native button element to increment the count.",
    );
    on(button, "click", () => ({ count: host.count + 1 }));
    // preserveComments: the Storybook story interpolates this element's
    // content via a lit-html expression; the default (non-preserving) write
    // would eject Lit's ChildPart marker comments and break re-renders
    // driven by Controls.
    watch("count", bindText(count, true));
  },
);

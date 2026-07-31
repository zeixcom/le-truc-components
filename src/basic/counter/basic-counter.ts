import { asInteger, bindText, defineComponent } from "@zeix/le-truc";

export type BasicCounterProps = {
  count: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-counter": HTMLElement & BasicCounterProps;
  }
}

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

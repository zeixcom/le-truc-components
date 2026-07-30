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
    watch("subject", bindText(output));
  },
);

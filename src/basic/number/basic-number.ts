import {
  asNumber,
  bindText,
  defineComponent,
  observedAttributes,
} from "@zeix/le-truc";
import { getLocale } from "../../_common/getLocale";
import { getNumberFormatter } from "../../_common/getNumberFormatter";

export type BasicNumberProps = {
  value: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-number": HTMLElement & BasicNumberProps;
  }
}

export default defineComponent<BasicNumberProps>(
  "basic-number",
  ({ expose, host, watch }) => {
    expose({ value: asNumber() });

    const formatter = getNumberFormatter(
      getLocale(host),
      host.getAttribute("options"),
    );
    watch(() => formatter.format(host.value), bindText(host, true));
  },
  // Storybook uses React which updates attributes instead of properties
  // Remove if you don't need that interoperability layer
  [observedAttributes(["value"])],
);

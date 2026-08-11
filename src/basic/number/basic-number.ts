import {
  asNumber,
  bindText,
  defineComponent,
  observedAttributes,
} from "@zeix/le-truc";
import { getLocale } from "../../_common/getLocale";
import { getNumberFormatter } from "../../_common/getNumberFormatter";

export type BasicNumberProps = {
  /** The numeric value to display, formatted via `Intl.NumberFormat`. */
  value: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-number": HTMLElement & BasicNumberProps;
  }
}

/**
 * Displays a `value` formatted with `Intl.NumberFormat`, re-formatting live
 * whenever `value` changes. Locale is resolved from the nearest ancestor's
 * `lang` attribute (falling back to `en`); formatting options are read once
 * at connect time from the `options` attribute as a JSON
 * `Intl.NumberFormatOptions` object, e.g. `{"style":"currency","currency":"EUR"}`.
 * @attribute {string} [lang] - BCP 47 locale tag (e.g. `de-CH`). Falls back to the nearest ancestor's `lang` attribute, or `en` if none is set. Read once at connect time.
 * @attribute {Intl.NumberFormatOptions} [options={}] - `Intl.NumberFormat` options as a JSON object. Read once at connect time.
 * @demo {https://zeixcom.github.io/le-truc/examples.html#basic-number} Interactive preview and usage examples
 */
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

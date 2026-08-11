import {
  asClampedInteger,
  bindText,
  bindVisible,
  defineComponent,
  observedAttributes,
} from "@zeix/le-truc";
import { getLocale } from "../../_common/getLocale";

export type BasicPluralizeProps = {
  /** The count driving pluralization; clamped to a non-negative integer. */
  count: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-pluralize": HTMLElement & BasicPluralizeProps;
  }
}

/**
 * Selects which of several child elements to show based on the CLDR plural
 * category (`zero`, `one`, `two`, `few`, `many`, `other`) or none/some state
 * for `count`, using `Intl.PluralRules`. The host may contain any subset of
 * `.zero`, `.one`, `.two`, `.few`, `.many`, `.other`, `.none`, `.some`
 * elements — only those present are toggled — plus an optional `.count`
 * element that displays the raw count. Locale is resolved from the nearest
 * ancestor's `lang` attribute (falling back to `en`).
 * @attribute {string} [lang] - BCP 47 locale tag (e.g. `de-CH`). Falls back to the nearest ancestor's `lang` attribute, or `en` if none is set. Read once at connect time.
 * @attribute {boolean} [ordinal=false] - When present, use ordinal (1st, 2nd, 3rd) instead of cardinal plural rules. Read once at connect time.
 * @demo {https://zeixcom.github.io/le-truc/examples.html#basic-pluralize} Interactive preview and usage examples
 */
export default defineComponent<BasicPluralizeProps>(
  "basic-pluralize",
  ({ expose, first, host, watch }) => {
    const count = first(".count");
    const none = first(".none");
    const some = first(".some");

    const pluralizer = new Intl.PluralRules(
      getLocale(host),
      host.hasAttribute("ordinal") ? { type: "ordinal" } : undefined,
    );

    expose({
      count: asClampedInteger(),
    });

    const categoryElements: Partial<
      Record<Intl.LDMLPluralRule, HTMLElement | undefined>
    > = {
      zero: first(".zero"),
      one: first(".one"),
      two: first(".two"),
      few: first(".few"),
      many: first(".many"),
      other: first(".other"),
    };

    if (count) watch("count", bindText(count));
    if (none) watch(() => host.count === 0, bindVisible(none));
    if (some) watch(() => host.count !== 0, bindVisible(some));

    const categories = pluralizer.resolvedOptions().pluralCategories;
    for (const category of categories) {
      const el = categoryElements[category];
      if (el)
        watch(
          () => pluralizer.select(host.count) === category,
          bindVisible(el),
        );
    }
  },
  // Storybook uses React which updates attributes instead of properties
  // Remove if you don't need that interoperability layer
  [observedAttributes(["count"])],
);

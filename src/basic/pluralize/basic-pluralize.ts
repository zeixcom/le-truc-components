import {
  asClampedInteger,
  bindText,
  bindVisible,
  defineComponent,
  observedAttributes,
} from "@zeix/le-truc";
import { getLocale } from "../../_common/getLocale";

export type BasicPluralizeProps = {
  count: number;
};

declare global {
  interface HTMLElementTagNameMap {
    "basic-pluralize": HTMLElement & BasicPluralizeProps;
  }
}

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

export const html = (
  strings: TemplateStringsArray,
  // biome-ignore lint/suspicious/noExplicitAny: template literal values are unconstrained
  ...values: any[]
): string => String.raw({ raw: strings }, ...values);

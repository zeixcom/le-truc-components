import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/web-components-vite",
  "staticDirs": [
    "../public",
    { from: "../src/module/lazyload/mocks", to: "/mocks/lazyload" },
    { from: "../src/module/listnav/mocks", to: "/pages" },
    { from: "../src/form/listbox/mocks", to: "/mocks/listbox" },
  ],
};
export default config;
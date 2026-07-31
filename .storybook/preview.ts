import { setCustomElementsManifest } from "@storybook/web-components";
import type { Preview } from "@storybook/web-components-vite";
import customElements from "../custom-elements.json";
import "../src/_global.css";

setCustomElementsManifest(customElements);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    docs: {
      source: {
        transform: (src: string) =>
          src
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&"),
      },
    },
  },
};

export default preview;

import { setCustomElementsManifest } from "@storybook/web-components";
import type { Decorator, Preview } from "@storybook/web-components-vite";
import { useEffect } from "storybook/preview-api";
import { themes } from "storybook/theming";
import customElements from "../custom-elements.json";
// biome-ignore lint/suspicious/noTsIgnore: ignore TS error for side-effect CSS import
// @ts-ignore: editors falling back to a classic TS language server misresolve this side-effect CSS import under noUncheckedSideEffectImports
import "../src/_global.css";

setCustomElementsManifest(customElements);

// Storybook itself falls back to the OS color scheme when no theme is set
// explicitly (see manager dark mode detection); mirror that default here so
// docs pages and story backgrounds start out matching Storybook's theme.
const prefersDark =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

// Drive light-dark() in component CSS from the chosen background: syncing
// color-scheme (via [data-theme] in src/_global.css) to the "backgrounds"
// toolbar makes Le Truc components follow whichever background is selected.
const withColorScheme: Decorator = (Story, context) => {
  const background = context.globals.backgrounds;
  const theme =
    (typeof background === "string" ? background : background?.value) ??
    (prefersDark ? "dark" : "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return Story();
};

const preview: Preview = {
  decorators: [withColorScheme],
  parameters: {
    backgrounds: {
      options: {
        light: { name: "Light", value: "#ecebef" },
        dark: { name: "Dark", value: "#242326" },
      },
    },

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
      theme: prefersDark ? themes.dark : themes.light,
      source: {
        transform: (src: string) =>
          src
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&"),
      },
    },
  },

  initialGlobals: {
    backgrounds: { value: prefersDark ? "dark" : "light" },
  },
};

export default preview;

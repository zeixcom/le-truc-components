import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { until } from "lit/directives/until.js";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { BasicButton } from "../../basic/button/basic-button.html";
import { ModuleScrollarea } from "../scrollarea/module-scrollarea.html";

export type ModuleCodeblockArgs = {
  collapsed: boolean;
};

export const sampleCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

// In production this component always receives already-highlighted markup
// (Shiki runs server-side in the Bun docs pipeline before the sample ever
// reaches module-codeblock.ts). Storybook has no server-side step, so Shiki
// runs here instead — kept out of module-codeblock.ts so the shipped
// component never carries a highlighter it won't use in real usage.
// Loaded via the fine-grained core bundle (one theme, one language, no
// WASM engine) instead of the top-level `shiki` package, whose codeToHtml()
// pulls in every bundled language/theme as separate chunks — fine for a
// server-side docs build, wasteful for a client-side Storybook build.
const highlighter = createHighlighterCore({
  themes: [import("shiki/themes/monokai.mjs")],
  langs: [import("shiki/langs/javascript.mjs")],
  engine: createJavaScriptRegexEngine(),
});

// codeToHtml() wraps its own <pre><code>; only the inner markup is reused so
// our own <pre><code class="language-js"> (styled by module-codeblock.css,
// scrolled by module-scrollarea) stays the single source of structure.
export const highlightedSampleCode = highlighter
  .then((shiki) =>
    shiki.codeToHtml(sampleCode, { lang: "javascript", theme: "monokai" }),
  )
  .then((fullHtml) => {
    const inner = new DOMParser()
      .parseFromString(fullHtml, "text/html")
      .querySelector("code")?.innerHTML;
    return unsafeHTML(inner ?? sampleCode);
  });

// Exported so other components' stories can embed a codeblock instance via
// ${ModuleCodeblock(args)} instead of duplicating its markup.
export const ModuleCodeblock = ({ collapsed }: ModuleCodeblockArgs) => html`
  <module-codeblock ?collapsed=${collapsed}>
    ${ModuleScrollarea({
      orientation: "horizontal",
      style: "",
      content: html`<pre><code class="language-js">${until(highlightedSampleCode, sampleCode)}</code></pre>`,
    })}
    ${BasicButton({
      label: "Copy",
      size: "small",
      hostClass: "copy",
      copySuccess: "Copied!",
      copyError: "Error!",
    })}
    <button type="button" class="overlay" aria-expanded=${collapsed ? "false" : "true"}>
      Expand
    </button>
  </module-codeblock>
`;

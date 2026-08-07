import { html } from "lit";
import { BasicButton } from "../../basic/button/basic-button.html";
import { ModuleScrollarea } from "../scrollarea/module-scrollarea.html";

export type ModuleCodeblockArgs = {
  collapsed: boolean;
};

export const sampleCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

// Exported so other components' stories can embed a codeblock instance via
// ${ModuleCodeblock(args)} instead of duplicating its markup.
export const ModuleCodeblock = ({ collapsed }: ModuleCodeblockArgs) => html`
  <module-codeblock ?collapsed=${collapsed}>
    ${ModuleScrollarea({
      orientation: "horizontal",
      style: "",
      content: html`<pre><code class="language-js">${sampleCode}</code></pre>`,
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

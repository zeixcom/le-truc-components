import { html } from "lit";

export type ModuleCodeblockArgs = {
  collapsed: boolean;
};

export const sampleCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

// Exported so other components' stories can embed a codeblock instance via
// ${Codeblock(args)} instead of duplicating its markup.
export const Codeblock = ({ collapsed }: ModuleCodeblockArgs) => html`
  <module-codeblock ?collapsed=${collapsed}>
    <module-scrollarea orientation="horizontal">
      <pre><code class="language-js">${sampleCode}</code></pre>
    </module-scrollarea>
    <basic-button class="copy" copy-success="Copied!" copy-error="Error!">
      <button type="button" class="secondary small">
        <span class="label">Copy</span>
      </button>
    </basic-button>
    <button type="button" class="overlay" aria-expanded=${collapsed ? "false" : "true"}>
      Expand
    </button>
  </module-codeblock>
`;

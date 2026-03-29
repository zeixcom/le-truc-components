import type { Meta, StoryObj } from "@storybook/web-components";
import "./module-listnav.ts";
import "./module-listnav.css";
import "../../form/listbox/form-listbox.ts";
import "../../form/listbox/form-listbox.css";
import "../../module/lazyload/module-lazyload.ts";
import "../../card/callout/card-callout.css";

const meta: Meta = {
  title: "Module/Listnav",
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <module-listnav>
      <nav>
        <h2 id="listnav-label" class="visually-hidden">Pages</h2>
        <form-listbox value="./pages/page1.html">
          <input type="hidden" name="page" />
          <div role="listbox" aria-labelledby="listnav-label">
            <div role="group" aria-labelledby="listnav-section1">
              <div role="presentation" id="listnav-section1">Getting Started</div>
              <button type="button" role="option" tabindex="0" value="./pages/page1.html" aria-selected="true">Page 1</button>
              <button type="button" role="option" tabindex="-1" value="./pages/page2.html">Page 2</button>
              <button type="button" role="option" tabindex="-1" value="./pages/page3.html">Page 3</button>
            </div>
            <div role="group" aria-labelledby="listnav-section2">
              <div role="presentation" id="listnav-section2">More Pages</div>
              <button type="button" role="option" tabindex="-1" value="./pages/page4.html">Page 4</button>
              <button type="button" role="option" tabindex="-1" value="./pages/page5.html">Page 5</button>
            </div>
          </div>
        </form-listbox>
      </nav>
      <module-lazyload>
        <card-callout>
          <p class="loading" role="status">Loading...</p>
          <p class="error" role="alert" aria-live="assertive" hidden></p>
        </card-callout>
        <div class="content" hidden></div>
      </module-lazyload>
    </module-listnav>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Listnav } from "./module-listnav.html";
import "./module-listnav.ts";
import "./module-listnav.css";
import "../../form/listbox/form-listbox.ts";
import "../../form/listbox/form-listbox.css";
import "../../module/lazyload/module-lazyload.ts";
import "../../card/callout/card-callout.css";

const meta: Meta = {
  title: "Module/Listnav",
  render: Listnav,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-listnav");
    await customElements.whenDefined("form-listbox");
    const canvas = within(canvasElement);
    const listbox = canvasElement.querySelector(
      "form-listbox",
    ) as HTMLElement & {
      value: string;
      filter: string;
    };
    const lazyload = canvasElement.querySelector(
      "module-lazyload",
    ) as HTMLElement & { src: string };

    // Initial selection is synced to the hash on connect.
    await waitFor(() => expect(location.hash).toBe("#page1"));

    // Selecting a different option updates the hash.
    await userEvent.click(canvas.getByText("Page 2"));
    await expect(listbox.value).toBe("./pages/page2.html");
    await waitFor(() => expect(location.hash).toBe("#page2"));

    // module-lazyload receives its src via pass(lazyload, { src: () => listbox.value }).
    await expect(lazyload.src).toBe("./pages/page2.html");

    // Simulating browser back/forward (hashchange) updates the selection.
    history.replaceState(null, "", "#page4");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await waitFor(() => expect(listbox.value).toBe("./pages/page4.html"));
    await expect(lazyload.src).toBe("./pages/page4.html");

    // Unknown hash: no matching option, selection stays put.
    history.replaceState(null, "", "#does-not-exist");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await expect(listbox.value).toBe("./pages/page4.html");

    history.replaceState(null, "", `${location.pathname}${location.search}`);
  },
};

export const FilterResetOnHashChange: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-listnav");
    await customElements.whenDefined("form-listbox");
    const listbox = canvasElement.querySelector(
      "form-listbox",
    ) as HTMLElement & {
      value: string;
      filter: string;
    };

    await waitFor(() => expect(location.hash).toBe("#page1"));

    // A filter typed into the listbox must not survive a hash-driven
    // selection change (browser back/forward) — it's cleared in the same
    // batch as the value update.
    listbox.filter = "page";
    await expect(listbox.filter).toBe("page");

    history.replaceState(null, "", "#page3");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await waitFor(() => expect(listbox.value).toBe("./pages/page3.html"));
    await expect(listbox.filter).toBe("");

    history.replaceState(null, "", `${location.pathname}${location.search}`);
  },
};

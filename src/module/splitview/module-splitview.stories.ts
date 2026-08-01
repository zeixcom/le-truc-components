import type { Meta, StoryObj } from "@storybook/web-components";
import { expect, spyOn, userEvent } from "storybook/test";
import { Splitview } from "./module-splitview.html";
import "./module-splitview.ts";
import "./module-splitview.css";
import "../scrollarea/module-scrollarea.ts";
import "../scrollarea/module-scrollarea.css";

const meta: Meta = {
  title: "Module/Splitview",
  render: Splitview,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-splitview");
    // biome-ignore lint/style/noNonNullAssertion: rendered unconditionally by the story; if missing, the assertions below fail loudly.
    const horizontal = canvasElement.querySelector("#horizontal-splitview")!;
    const divider =
      // biome-ignore lint/style/noNonNullAssertion: rendered unconditionally by the story; if missing, the assertions below fail loudly.
      horizontal.querySelector<HTMLButtonElement>("button.divider")!;
    // Initial ratio is 50% → aria-valuenow reflects it.
    await expect(divider.getAttribute("aria-valuenow")).toBe("50");
    divider.focus();
  },
};

export const KeyboardControl: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-splitview");
    const host = canvasElement.querySelector(
      "#horizontal-splitview",
    ) as HTMLElement & { split: number };
    const divider = host.querySelector<HTMLButtonElement>("button.divider");
    if (!divider) throw new Error("Missing button.divider");
    divider.focus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(host.split).toBeCloseTo(0.55);
    await expect(divider.getAttribute("aria-valuenow")).toBe("55");
    await expect(host.style.getPropertyValue("--module-splitview-ratio")).toBe(
      "55.00%",
    );

    await userEvent.keyboard("{ArrowLeft}");
    await expect(host.split).toBeCloseTo(0.5);
    await expect(divider.getAttribute("aria-valuenow")).toBe("50");

    await userEvent.keyboard("{End}");
    await expect(host.split).toBeCloseTo(0.9);
    await expect(divider.getAttribute("aria-valuenow")).toBe("90");

    // Already at max — incrementing further stays clamped.
    await userEvent.keyboard("{ArrowRight}");
    await expect(host.split).toBeCloseTo(0.9);

    await userEvent.keyboard("{Home}");
    await expect(host.split).toBeCloseTo(0.1);
    await expect(divider.getAttribute("aria-valuenow")).toBe("10");

    // Already at min — decrementing further stays clamped.
    await userEvent.keyboard("{ArrowLeft}");
    await expect(host.split).toBeCloseTo(0.1);

    // Unrelated key: no change, no preventDefault side effect.
    await userEvent.keyboard("a");
    await expect(host.split).toBeCloseTo(0.1);

    // Reset for other stories/tests sharing this DOM.
    host.split = 0.5;
  },
};

export const KeyboardControlVertical: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-splitview");
    const host = canvasElement.querySelector(
      "#vertical-splitview",
    ) as HTMLElement & { split: number };
    const divider = host.querySelector<HTMLButtonElement>("button.divider");
    if (!divider) throw new Error("Missing button.divider");
    divider.focus();

    await userEvent.keyboard("{ArrowDown}");
    await expect(host.split).toBeCloseTo(0.55);

    await userEvent.keyboard("{ArrowUp}");
    await expect(host.split).toBeCloseTo(0.5);

    host.split = 0.5;
  },
};

export const PointerDrag: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-splitview");
    const host = canvasElement.querySelector(
      "#horizontal-splitview",
    ) as HTMLElement & { split: number };
    const divider = host.querySelector<HTMLButtonElement>("button.divider");
    if (!divider) throw new Error("Missing button.divider");

    const rect = host.getBoundingClientRect();
    const clientY = rect.top + rect.height / 2;
    const xForRatio = (ratio: number) => rect.left + ratio * rect.width;

    // Real pointer capture requires an active hardware pointer, which a
    // synthetic PointerEvent doesn't provide — stub it out so the drag
    // handlers run without throwing.
    const captureSpy = spyOn(
      HTMLElement.prototype,
      "setPointerCapture",
    ).mockImplementation(() => {});

    divider.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        clientX: xForRatio(0.5),
        clientY,
        bubbles: true,
      }),
    );
    divider.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: xForRatio(0.7),
        clientY,
        bubbles: true,
      }),
    );
    await expect(host.split).toBeCloseTo(0.7, 1);
    await expect(divider.getAttribute("aria-valuenow")).toBe("70");

    divider.dispatchEvent(
      new PointerEvent("pointerup", {
        pointerId: 1,
        clientX: xForRatio(0.7),
        clientY,
        bubbles: true,
      }),
    );

    // After pointerup, dragging is false — a further move is a no-op.
    divider.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: xForRatio(0.2),
        clientY,
        bubbles: true,
      }),
    );
    await expect(host.split).toBeCloseTo(0.7, 1);

    // lostpointercapture (e.g. the OS steals the pointer) also stops
    // dragging, distinct from a regular pointerup.
    divider.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 2,
        clientX: xForRatio(0.7),
        clientY,
        bubbles: true,
      }),
    );
    divider.dispatchEvent(new Event("lostpointercapture", { bubbles: true }));
    divider.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 2,
        clientX: xForRatio(0.3),
        clientY,
        bubbles: true,
      }),
    );
    await expect(host.split).toBeCloseTo(0.7, 1);

    captureSpy.mockRestore();

    // Reset for other stories/tests sharing this DOM.
    host.split = 0.5;
  },
};

export const DirectPropertyAssignment: Story = {
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-splitview");
    const host = canvasElement.querySelector(
      "#horizontal-splitview",
    ) as HTMLElement & { split: number };
    const divider = host.querySelector<HTMLButtonElement>("button.divider");
    if (!divider) throw new Error("Missing button.divider");

    // Setting `split` as a prop (not via keyboard/pointer) still drives the
    // CSS var and aria-valuenow watch() effect.
    host.split = 0.3;
    await expect(divider.getAttribute("aria-valuenow")).toBe("30");
    await expect(host.style.getPropertyValue("--module-splitview-ratio")).toBe(
      "30.00%",
    );

    host.split = 0.5;
  },
};

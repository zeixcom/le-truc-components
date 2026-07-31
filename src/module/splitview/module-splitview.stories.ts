import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent } from "storybook/test";
import "./module-splitview.ts";
import "./module-splitview.css";
import "../scrollarea/module-scrollarea.ts";
import "../scrollarea/module-scrollarea.css";

const render = () => html`
  <!-- Horizontal split (default) -->
  <module-splitview id="horizontal-splitview">
    <module-scrollarea>
      <div>
        <p>Left panel</p>
        <p>Drag the handle or focus it and use arrow keys to resize.</p>
      </div>
    </module-scrollarea>
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation="horizontal"
      aria-valuenow="50"
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    <module-scrollarea>
      <div>
        <p>Right panel</p>
        <p>The proportions are kept when the container is resized.</p>
      </div>
    </module-scrollarea>
  </module-splitview>

  <hr />

  <!-- Pre-set split position via attribute -->
  <module-splitview id="preset-splitview" split="0.3">
    <module-scrollarea>
      <div>
        <p>Narrow panel (30%)</p>
      </div>
    </module-scrollarea>
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation="horizontal"
      aria-valuenow="30"
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    <module-scrollarea>
      <div>
        <p>Wide panel (70%)</p>
      </div>
    </module-scrollarea>
  </module-splitview>

  <hr />

  <!-- Vertical split -->
  <module-splitview id="vertical-splitview" orientation="vertical">
    <module-scrollarea>
      <div>
        <p>Top panel</p>
      </div>
    </module-scrollarea>
    <button
      type="button"
      class="divider"
      role="separator"
      aria-label="Resize panels"
      aria-orientation="vertical"
      aria-valuenow="50"
      aria-valuemin="10"
      aria-valuemax="90"
    ></button>
    <module-scrollarea>
      <div>
        <p>Bottom panel</p>
      </div>
    </module-scrollarea>
  </module-splitview>
`;

const meta: Meta = {
  title: "Module/Splitview",
  render,
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

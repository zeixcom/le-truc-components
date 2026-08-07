import type { Meta, StoryObj } from "@storybook/web-components";
import type { FormAssociatedElement } from "@zeix/le-truc";
import { html } from "lit";
import {
  expect,
  fireEvent,
  spyOn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import {
  FormColorgraph,
  type FormColorgraphArgs,
} from "./form-colorgraph.html";
import "../spinbutton/form-spinbutton.ts";
import "../spinbutton/form-spinbutton.css";
import "./form-colorgraph.ts";
import "./form-colorgraph.css";
import type { FormSpinbuttonProps } from "../spinbutton/form-spinbutton.ts";
import type { FormColorgraphProps } from "./form-colorgraph.ts";

type ColorgraphEl = HTMLElement & FormAssociatedElement & FormColorgraphProps;
type FormSpinbuttonEl = HTMLElement &
  FormAssociatedElement &
  FormSpinbuttonProps;

const meta: Meta<FormColorgraphArgs> = {
  title: "Form/Colorgraph",
  render: ({ name, value }) => html`
    <form>${FormColorgraph({ name, value })}</form>
  `,
  argTypes: {
    name: {
      control: "text",
      description: "Form field name",
      table: { category: "Attributes" },
    },
    value: {
      control: "color",
      description:
        "The selected color as a CSS string — accepts any valid CSS color string, parsed internally into Oklch. Form value.",
      table: { category: "Reactive Properties" },
    },
  },
};
export default meta;
type Story = StoryObj<FormColorgraphArgs>;

export const Default: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    // Initial value is parsed and reflected into the lightness input (0.48 → 48).
    const lightnessInput = canvas.getByLabelText(
      "Lightness",
    ) as HTMLInputElement;
    await expect(lightnessInput.value).toBe("48");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    await expect(el.hue).toBeCloseTo(263, 0);
    await expect(el.chroma).toBeCloseTo(0.23, 2);
  },
};

export const StepButtons: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;

    const lightnessBefore = el.lightness;
    await userEvent.click(
      canvas.getByRole("button", { name: "Increment lightness" }),
    );
    await expect(el.lightness).toBeGreaterThan(lightnessBefore);

    await userEvent.click(
      canvas.getByRole("button", { name: "Decrement lightness" }),
    );
    await expect(el.lightness).toBeCloseTo(lightnessBefore, 4);

    // Direct method calls, not just the buttons that wrap them.
    const hueBefore = el.hue;
    el.stepUp("h", true);
    await expect(el.hue).toBeGreaterThan(hueBefore);
    el.stepDown("h", true);
    await expect(el.hue).toBeCloseTo(hueBefore, 4);
  },
};

export const KeyboardControl: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;

    const lightnessInput = canvas.getByLabelText("Lightness");
    lightnessInput.focus();
    const lightnessBefore = el.lightness;
    await userEvent.keyboard("{ArrowUp}");
    await expect(el.lightness).toBeGreaterThan(lightnessBefore);
    await userEvent.keyboard("{ArrowDown}");
    await expect(el.lightness).toBeCloseTo(lightnessBefore, 4);

    // ArrowLeft/ArrowRight are reserved for the native input's text caret
    // when focus is on an <input> — only ArrowUp/ArrowDown (and +/-) step
    // the value in that case.
    const chromaInput = canvas.getByLabelText("Chroma");
    chromaInput.focus();
    const chromaBefore = el.chroma;
    await userEvent.keyboard("{ArrowUp}");
    await expect(el.chroma).toBeGreaterThan(chromaBefore);
    await userEvent.keyboard("{ArrowDown}");
    await expect(el.chroma).toBeCloseTo(chromaBefore, 4);

    const slider = canvas.getByRole("slider");
    slider.focus();
    const hueBefore = el.hue;
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.hue).toBeGreaterThan(hueBefore);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.hue).toBeCloseTo(hueBefore, 4);

    // Unrelated key: no change.
    await userEvent.keyboard("a");
    await expect(el.hue).toBeCloseTo(hueBefore, 4);
  },
};

export const OutOfGamutError: Story = {
  args: {
    name: "color",
    value: "oklch(.9 .1 145)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    const chromaInput = canvas.getByLabelText("Chroma") as HTMLInputElement;

    // A very high lightness combined with high chroma falls outside the
    // P3 gamut, so the commit is rejected and the shared out-of-gamut
    // error is shown as a customError (not tied to any single axis).
    await expect(el.validity.valid).toBe(true);
    chromaInput.focus();
    chromaInput.value = "0.4";
    await fireEvent.change(chromaInput);

    await expect(el.validity.valid).toBe(false);
    await expect(el.validity.customError).toBe(true);
    const colorError = canvasElement.querySelector("#color-error");
    await expect(colorError).toHaveTextContent("Color out of gamut");

    // A subsequent valid commit clears the error.
    chromaInput.value = "0.05";
    await fireEvent.change(chromaInput);
    await expect(el.validity.valid).toBe(true);
    await expect(colorError).toHaveTextContent("");
  },
};

export const AxisRangeError: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    const chromaAxis = canvasElement.querySelector(
      "form-spinbutton.chroma",
    ) as FormSpinbuttonEl;

    // A value past the chroma axis's own max (0.4) is a plain rangeOverflow
    // on that single field — not a joint gamut question, so form-colorgraph
    // never even attempts a P3 commit and its own validity stays untouched.
    // Only the axis form-spinbutton itself goes invalid. Direct property
    // assignment (not a native input change, which form-spinbutton always
    // clamps to min/max) is what can put a single field out of range.
    await expect(el.validity.valid).toBe(true);
    chromaAxis.value = 0.5;

    await expect(chromaAxis.validity.rangeOverflow).toBe(true);
    await expect(el.validity.valid).toBe(true);
    const chromaError = canvasElement.querySelector("#chroma-error");
    await expect(chromaError).not.toHaveTextContent("");
    const colorError = canvasElement.querySelector("#color-error");
    await expect(colorError).toHaveTextContent("");

    // A subsequent in-range value clears the axis-local error.
    chromaAxis.value = 0.1;
    await expect(chromaAxis.validity.valid).toBe(true);
    await expect(chromaError).toHaveTextContent("");
  },
};

export const AttributeMutation: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;

    // Regression test for observedAttributes(['value']): a Storybook
    // Controls edit (or a React wrapper) sets the attribute after connect,
    // which must re-parse into the readonly l/c/h props.
    el.setAttribute("value", "oklch(.7 .1 30)");
    await expect(el.hue).toBeCloseTo(30, 0);
    await expect(el.lightness).toBeCloseTo(0.7, 2);
  },
};

export const AchromaticHueFallback: Story = {
  args: {
    name: "color",
    // Zero chroma is achromatic — culori leaves the `h` channel undefined
    // rather than defaulting it to 0.
    value: "oklch(0.5 0 none)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;

    // The exposed `hue` prop falls back to 0 when the parsed color has no
    // hue channel, keeping it numeric instead of `undefined`.
    await expect(el.hue).toBe(0);
    await expect(el.chroma).toBeCloseTo(0, 4);
  },
};

export const ChangeEventIgnoredWhenAxisInvalid: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    await customElements.whenDefined("form-spinbutton");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    const chromaAxis = canvasElement.querySelector(
      "form-spinbutton.chroma",
    ) as FormSpinbuttonEl;

    const valueBefore = el.value;
    chromaAxis.value = 0.5; // exceeds chroma's own max (0.4)
    await expect(chromaAxis.validity.valid).toBe(false);

    // form-spinbutton itself never dispatches 'change' for an invalid
    // value (it reverts silently instead), but form-colorgraph's own
    // change handler still guards against it defensively — a 'change'
    // event while the axis is invalid must not attempt a joint gamut
    // commit, leaving the color value untouched.
    chromaAxis.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(el.value).toBe(valueBefore);
  },
};

export const KeyboardArrowLeftRightOnAxisButton: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;

    // form-spinbutton doesn't listen for Arrow Left/Right, so they bubble
    // up to form-colorgraph, which routes them to the axis matching the
    // focused control (getAxis()) — distinct from Arrow Up/Down, which
    // form-spinbutton intercepts itself.
    const chromaIncrement = canvas.getByRole("button", {
      name: "Increment chroma",
    });
    chromaIncrement.focus();
    const chromaBefore = el.chroma;
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.chroma).toBeGreaterThan(chromaBefore);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.chroma).toBeCloseTo(chromaBefore, 4);

    const lightnessDecrement = canvas.getByRole("button", {
      name: "Decrement lightness",
    });
    lightnessDecrement.focus();
    const lightnessBefore = el.lightness;
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.lightness).toBeGreaterThan(lightnessBefore);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.lightness).toBeCloseTo(lightnessBefore, 4);

    const hueIncrement = canvas.getByRole("button", { name: "Increment hue" });
    hueIncrement.focus();
    const hueBefore = el.hue;
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.hue).toBeGreaterThan(hueBefore);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.hue).toBeCloseTo(hueBefore, 4);

    // ArrowLeft/ArrowRight are reserved for the native input's text caret
    // when focus is on the <input> itself — the early return in the
    // keydown handler bails before routing to any axis.
    const chromaInput = canvas.getByLabelText("Chroma");
    chromaInput.focus();
    const chromaFromInput = el.chroma;
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.chroma).toBeCloseTo(chromaFromInput, 4);
  },
};

export const KeyboardNavigationOnGraph: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;

    // Focus outside any axis and outside the hue slider (the knob) falls
    // through to the plain switch-case: Up/Down step lightness, Left/Right
    // step chroma, +/- step hue.
    const knob = canvas.getByText("Drag").closest("button") as HTMLElement;
    knob.focus();

    const lightnessBefore = el.lightness;
    await userEvent.keyboard("{ArrowUp}");
    await expect(el.lightness).toBeGreaterThan(lightnessBefore);
    await userEvent.keyboard("{ArrowDown}");
    await expect(el.lightness).toBeCloseTo(lightnessBefore, 4);

    const chromaBefore = el.chroma;
    await userEvent.keyboard("{ArrowRight}");
    await expect(el.chroma).toBeGreaterThan(chromaBefore);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(el.chroma).toBeCloseTo(chromaBefore, 4);

    const hueBefore = el.hue;
    await userEvent.keyboard("+");
    await expect(el.hue).toBeGreaterThan(hueBefore);
    await userEvent.keyboard("-");
    await expect(el.hue).toBeCloseTo(hueBefore, 4);
  },
};

export const GraphPointerDrag: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    const graphEl = canvasElement.querySelector(".graph") as HTMLElement;
    const canvas = graphEl.querySelector("canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    // Real pointer capture requires an active hardware pointer, which a
    // synthetic PointerEvent doesn't provide — stub it out so the drag
    // handlers run without throwing.
    const captureSpy = spyOn(
      HTMLElement.prototype,
      "setPointerCapture",
    ).mockImplementation(() => {});

    const chromaBefore = el.chroma;
    graphEl.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        clientX: rect.left,
        clientY: rect.top,
        bubbles: true,
      }),
    );
    // Stay close to the initial in-gamut color (l≈0.48, c≈0.23 → x≈0.58,
    // y≈0.52) so the small move lands in the P3 gamut and actually commits
    // — moveKnob silently no-ops outside it.
    graphEl.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: rect.left + rect.width * 0.6,
        clientY: rect.top + rect.height * 0.5,
        bubbles: true,
      }),
    );
    await waitFor(() => expect(el.chroma).toBeGreaterThan(chromaBefore));

    // Dragging to the top-right corner (near-white, max chroma) lands
    // outside the P3 gamut — moveKnob silently no-ops rather than
    // committing, so the color stays at the last valid drag position.
    const valueBeforeOutOfGamut = el.value;
    graphEl.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: rect.left + rect.width,
        clientY: rect.top,
        bubbles: true,
      }),
    );
    // moveKnob is throttled to once per animation frame — give it a frame
    // to (not) run before asserting the no-commit outcome.
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    await expect(el.value).toBe(valueBeforeOutOfGamut);

    graphEl.dispatchEvent(
      new PointerEvent("pointerup", { pointerId: 1, bubbles: true }),
    );

    captureSpy.mockRestore();
  },
};

export const SliderPointerDrag: Story = {
  args: {
    name: "color",
    value: "oklch(.48 .23 263)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    const sliderEl = canvasElement.querySelector(".slider") as HTMLElement;
    const track = sliderEl.querySelector("canvas") as HTMLCanvasElement;
    const rect = track.getBoundingClientRect();

    const captureSpy = spyOn(
      HTMLElement.prototype,
      "setPointerCapture",
    ).mockImplementation(() => {});

    const hueBefore = el.hue;
    sliderEl.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        clientX: rect.left,
        clientY: rect.top,
        bubbles: true,
      }),
    );
    sliderEl.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: rect.left + rect.width * 0.75,
        clientY: rect.top,
        bubbles: true,
      }),
    );
    await waitFor(() => expect(el.hue).toBeGreaterThan(hueBefore));

    sliderEl.dispatchEvent(
      new PointerEvent("pointerup", { pointerId: 1, bubbles: true }),
    );

    captureSpy.mockRestore();
  },
};

export const SliderPointerDragOutOfGamutNoCommit: Story = {
  args: {
    name: "color",
    // High chroma at this lightness is only in gamut around hue 320.
    value: "oklch(0.6 0.3 320)",
  },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("form-colorgraph");
    const el = canvasElement.querySelector("form-colorgraph") as ColorgraphEl;
    const sliderEl = canvasElement.querySelector(".slider") as HTMLElement;
    const track = sliderEl.querySelector("canvas") as HTMLCanvasElement;
    const rect = track.getBoundingClientRect();

    const captureSpy = spyOn(
      HTMLElement.prototype,
      "setPointerCapture",
    ).mockImplementation(() => {});

    const valueBefore = el.value;
    sliderEl.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        clientX: rect.left,
        clientY: rect.top,
        bubbles: true,
      }),
    );
    // Rotating to hue ≈140 (ratio 0.39) at this lightness/chroma falls
    // outside the P3 gamut — moveThumb silently no-ops rather than
    // committing.
    sliderEl.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        clientX: rect.left + rect.width * 0.39,
        clientY: rect.top,
        bubbles: true,
      }),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    await expect(el.value).toBe(valueBefore);

    sliderEl.dispatchEvent(
      new PointerEvent("pointerup", { pointerId: 1, bubbles: true }),
    );

    captureSpy.mockRestore();
  },
};

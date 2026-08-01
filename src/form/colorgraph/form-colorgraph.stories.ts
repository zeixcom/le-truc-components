import type { Meta, StoryObj } from "@storybook/web-components";
import type { FormAssociatedElement } from "@zeix/le-truc";
import { html } from "lit";
import { expect, fireEvent, userEvent, within } from "storybook/test";
import { Colorgraph, type FormColorgraphArgs } from "./form-colorgraph.html";
import "./form-colorgraph.ts";
import "./form-colorgraph.css";
import type { FormColorgraphProps } from "./form-colorgraph.ts";

type ColorgraphEl = HTMLElement & FormAssociatedElement & FormColorgraphProps;

const meta: Meta<FormColorgraphArgs> = {
  title: "Form/Colorgraph",
  render: ({ name, value }) => html`
    <form>${Colorgraph({ name, value })}</form>
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
    // P3 gamut, so the commit is rejected and a per-axis error shown.
    await expect(el.validity.valid).toBe(true);
    chromaInput.focus();
    chromaInput.value = "0.4";
    await fireEvent.change(chromaInput);

    await expect(el.validity.valid).toBe(false);
    const chromaError = canvasElement.querySelector("#chroma-error");
    await expect(chromaError).toHaveTextContent("Color out of gamut");

    // A subsequent valid commit clears the error.
    chromaInput.value = "0.05";
    await fireEvent.change(chromaInput);
    await expect(el.validity.valid).toBe(true);
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

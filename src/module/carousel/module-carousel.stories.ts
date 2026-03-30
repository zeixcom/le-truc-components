import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "./module-carousel.ts";
import "./module-carousel.css";
import type { Component } from "@zeix/le-truc";
import type { ModuleCarouselProps } from "./module-carousel.ts";

type ModuleCarouselArgs = {
  index: number;
};

const render = ({ index }: ModuleCarouselArgs) => html`
  <module-carousel>
    <h2 class="visually-hidden">Slides</h2>
    <div class="slides">
      <div id="slide-a" role="tabpanel" aria-current=${index === 0 ? "true" : "false"}>
        <h3>Slide 1</h3>
        <p>First slide content.</p>
      </div>
      <div id="slide-b" role="tabpanel" aria-current=${index === 1 ? "true" : "false"}>
        <h3>Slide 2</h3>
        <p>Second slide content.</p>
      </div>
      <div id="slide-c" role="tabpanel" aria-current=${index === 2 ? "true" : "false"}>
        <h3>Slide 3</h3>
        <p>Third slide content.</p>
      </div>
    </div>
    <nav aria-label="Carousel Navigation">
      <button type="button" class="prev" aria-label="Previous">❮</button>
      <button type="button" class="next" aria-label="Next">❯</button>
      <div role="tablist">
        <button role="tab" aria-selected=${index === 0 ? "true" : "false"} aria-controls="slide-a" aria-label="Slide 1" data-index="0" tabindex=${index === 0 ? "0" : "-1"}>●</button>
        <button role="tab" aria-selected=${index === 1 ? "true" : "false"} aria-controls="slide-b" aria-label="Slide 2" data-index="1" tabindex=${index === 1 ? "0" : "-1"}>●</button>
        <button role="tab" aria-selected=${index === 2 ? "true" : "false"} aria-controls="slide-c" aria-label="Slide 3" data-index="2" tabindex=${index === 2 ? "0" : "-1"}>●</button>
      </div>
    </nav>
  </module-carousel>
`;

const meta: Meta<ModuleCarouselArgs> = {
  title: "Module/Carousel",
  render,
  argTypes: {
    index: {
      control: "number",
      table: {
        defaultValue: {
          summary: "index of first slide with aria-current=true (0)",
        },
        category: "Reactive Properties",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleCarouselArgs>;

export const Default: Story = {
  args: { index: 0 },
};

export const Navigation: Story = {
  args: { index: 0 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-carousel");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-carousel",
    ) as Component<ModuleCarouselProps>;

    await expect(el.index).toBe(0);
    // prev hidden on first slide
    await expect(canvas.getByLabelText("Previous")).not.toBeVisible();

    await userEvent.click(canvas.getByLabelText("Next"));
    await expect(el.index).toBe(1);
    await expect(canvas.getByLabelText("Previous")).toBeVisible();

    await userEvent.click(canvas.getByLabelText("Next"));
    await expect(el.index).toBe(2);
    // next hidden on last slide
    await expect(canvas.getByLabelText("Next")).not.toBeVisible();
  },
};

export const DotNavigation: Story = {
  args: { index: 0 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-carousel");
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector(
      "module-carousel",
    ) as Component<ModuleCarouselProps>;

    await userEvent.click(canvas.getByLabelText("Slide 3"));
    await expect(el.index).toBe(2);

    await userEvent.click(canvas.getByLabelText("Slide 1"));
    await expect(el.index).toBe(0);
  },
};

export const PropertyChanges: Story = {
  args: { index: 0 },
  play: async ({ canvasElement }) => {
    await customElements.whenDefined("module-carousel");
    const el = canvasElement.querySelector(
      "module-carousel",
    ) as Component<ModuleCarouselProps>;
    const slides = el.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    el.index = 1;
    await expect(slides[1]?.ariaCurrent).toBe("true");
    await expect(slides[0]?.ariaCurrent).toBe("false");
  },
};

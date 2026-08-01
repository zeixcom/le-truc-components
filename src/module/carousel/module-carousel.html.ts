import { html } from "lit";

export type ModuleCarouselArgs = {
  index: number;
};

// Exported so other components' stories can embed a carousel instance via
// ${Carousel(args)} instead of duplicating its markup.
export const Carousel = ({ index }: ModuleCarouselArgs) => html`
  <module-carousel>
    <h2 class="visually-hidden">Slides</h2>
    <div class="slides" tabindex="0">
      <div
        id="slide-a"
        role="tabpanel"
        aria-current=${index === 0 ? "true" : "false"}
      >
        <h3>Slide 1</h3>
        <p>First slide content.</p>
      </div>
      <div
        id="slide-b"
        role="tabpanel"
        aria-current=${index === 1 ? "true" : "false"}
      >
        <h3>Slide 2</h3>
        <p>Second slide content.</p>
      </div>
      <div
        id="slide-c"
        role="tabpanel"
        aria-current=${index === 2 ? "true" : "false"}
      >
        <h3>Slide 3</h3>
        <p>Third slide content.</p>
      </div>
    </div>
    <nav aria-label="Carousel Navigation">
      <button type="button" class="prev" aria-label="Previous">❮</button>
      <button type="button" class="next" aria-label="Next">❯</button>
      <div role="tablist" aria-label="Carousel Slides">
        <button
          role="tab"
          aria-selected=${index === 0 ? "true" : "false"}
          aria-controls="slide-a"
          aria-label="Slide 1"
          data-index="0"
          tabindex=${index === 0 ? "0" : "-1"}
        >
          ●
        </button>
        <button
          role="tab"
          aria-selected=${index === 1 ? "true" : "false"}
          aria-controls="slide-b"
          aria-label="Slide 2"
          data-index="1"
          tabindex=${index === 1 ? "0" : "-1"}
        >
          ●
        </button>
        <button
          role="tab"
          aria-selected=${index === 2 ? "true" : "false"}
          aria-controls="slide-c"
          aria-label="Slide 3"
          data-index="2"
          tabindex=${index === 2 ? "0" : "-1"}
        >
          ●
        </button>
      </div>
    </nav>
  </module-carousel>
`;

import { batch, bindState, createState, defineComponent } from "@zeix/le-truc";

const MIN_INTERSECTION_RATIO = 0;
const MAX_INTERSECTION_RATIO = 0.99; // ignore rounding errors of fraction pixels

declare global {
  interface HTMLElementTagNameMap {
    "module-scrollarea": HTMLElement;
  }
}

const observeOverflow =
  (
    content: Element,
    overflowCallback: () => void,
    noOverflowCallback: () => void,
  ) =>
  (container: HTMLElement) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (
          entry.intersectionRatio > MIN_INTERSECTION_RATIO &&
          entry.intersectionRatio < MAX_INTERSECTION_RATIO
        )
          overflowCallback();
        else batch(noOverflowCallback);
      },
      {
        root: container,
        threshold: [MIN_INTERSECTION_RATIO, MAX_INTERSECTION_RATIO],
      },
    );
    observer.observe(content);
    return () => {
      observer.disconnect();
    };
  };

export default defineComponent(
  "module-scrollarea",
  ({ host, internals, on, watch }) => {
    const child = host.firstElementChild;
    if (!child) return;

    const overflowStart = createState(false);
    const overflowEnd = createState(false);
    const hasOverflow = () => overflowStart.get() || overflowEnd.get();

    const scrollCallback =
      host.getAttribute("orientation") === "horizontal"
        ? () => {
            overflowStart.set(host.scrollLeft > 0);
            overflowEnd.set(
              host.scrollLeft < host.scrollWidth - host.offsetWidth,
            );
          }
        : () => {
            overflowStart.set(host.scrollTop > 0);
            overflowEnd.set(
              host.scrollTop < host.scrollHeight - host.offsetHeight,
            );
          };

    on(host, "scroll", () => {
      if (hasOverflow()) batch(scrollCallback);
    });

    watch(hasOverflow, bindState(internals, "overflow"));
    watch(hasOverflow, (overflow) => {
      // Only set tabindex="0" explicitly; never force -1. An explicit -1
      // opts the element out of Chromium's native "sequentially focusable
      // scrolling regions" heuristic, which — during the async gap before
      // this effect first runs — can leave a containing modal <dialog>
      // with a single tab stop, letting focus escape the modal.
      if (overflow) host.setAttribute("tabindex", "0");
      else host.removeAttribute("tabindex");
    });
    watch(overflowStart, bindState(internals, "overflow-start"));
    watch(overflowEnd, bindState(internals, "overflow-end"));
    watch(
      () => true,
      () =>
        observeOverflow(
          child,
          () => {
            overflowEnd.set(true);
          },
          () => {
            overflowStart.set(false);
            overflowEnd.set(false);
          },
        )(host),
    );
  },
);

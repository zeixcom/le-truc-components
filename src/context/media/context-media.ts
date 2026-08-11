import { createContext, createSensor, defineComponent } from "@zeix/le-truc";

export type ContextMediaMotion = "no-preference" | "reduce";
export type ContextMediaTheme = "light" | "dark";
export type ContextMediaViewport = "xs" | "sm" | "md" | "lg" | "xl";
export type ContextMediaOrientation = "portrait" | "landscape";

export type ContextMediaProps = {
  /** Whether the user prefers reduced motion, tracked live via `matchMedia`. */
  readonly motion: ContextMediaMotion;
  /** Preferred color scheme, tracked live via `matchMedia`. */
  readonly theme: ContextMediaTheme;
  /**
   * Current viewport size bucket, tracked live via `matchMedia`. Breakpoints
   * default to `sm=27em`, `md=45em`, `lg=75em`, `xl=125em` and can be
   * overridden with `sm`/`md`/`lg`/`xl` attributes (read once at connect
   * time).
   */
  readonly viewport: ContextMediaViewport;
  /** Current screen orientation, tracked live via `matchMedia`. */
  readonly orientation: ContextMediaOrientation;
};

declare global {
  interface HTMLElementTagNameMap {
    "context-media": HTMLElement & ContextMediaProps;
  }
}

/* === Exported Contexts === */

export const MEDIA_MOTION = createContext<() => ContextMediaMotion>("motion");
export const MEDIA_THEME = createContext<() => ContextMediaTheme>("theme");
export const MEDIA_VIEWPORT =
  createContext<() => ContextMediaViewport>("viewport");
export const MEDIA_ORIENTATION =
  createContext<() => ContextMediaOrientation>("orientation");

/* === Component === */

/**
 * Provides live media-query state (reduced-motion preference, color scheme,
 * viewport size bucket, orientation) to descendant components via context.
 * Wrap the parts of the page that need to react to these changes in
 * `<context-media>`, then consume the exported context tokens
 * (`MEDIA_MOTION`, `MEDIA_THEME`, `MEDIA_VIEWPORT`, `MEDIA_ORIENTATION`) with
 * `requestContext()`. All four properties are read-only and update
 * automatically as the underlying media queries change; the component
 * renders no markup of its own and should wrap other content.
 * @attribute {string} [sm=27em] - Min-width for the `sm` viewport breakpoint.
 * @attribute {string} [md=45em] - Min-width for the `md` viewport breakpoint.
 * @attribute {string} [lg=75em] - Min-width for the `lg` viewport breakpoint.
 * @attribute {string} [xl=125em] - Min-width for the `xl` viewport breakpoint.
 * @demo {https://zeixcom.github.io/le-truc/examples.html#context-media} Interactive preview and usage examples
 */
export default defineComponent<ContextMediaProps>(
  "context-media",
  ({ expose, host, provideContexts }) => {
    const getBreakpoint = (attr: string, fallback: string) => {
      const value = host.getAttribute(attr);
      const trimmed = value?.trim();
      if (!trimmed) return fallback;
      const unit = trimmed.match(/em$/) ? "em" : "px";
      const v = parseFloat(trimmed);
      return Number.isFinite(v) ? v + unit : fallback;
    };

    expose({
      // Context for motion preference
      motion: createSensor<ContextMediaMotion>(
        (set) => {
          const mql = matchMedia("(prefers-reduced-motion: reduce)");
          const listener = (e: MediaQueryListEvent) => {
            set(e.matches ? "reduce" : "no-preference");
          };
          mql.addEventListener("change", listener);
          return () => mql.removeEventListener("change", listener);
        },
        {
          value: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "reduce"
            : "no-preference",
        },
      ),

      // Context for preferred color scheme
      theme: createSensor<ContextMediaTheme>(
        (set) => {
          const mql = matchMedia("(prefers-color-scheme: dark)");
          const listener = (e: MediaQueryListEvent) => {
            set(e.matches ? "dark" : "light");
          };
          mql.addEventListener("change", listener);
          return () => mql.removeEventListener("change", listener);
        },
        {
          value: matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        },
      ),

      // Context for screen viewport size
      viewport: (() => {
        const breakpoints: [ContextMediaViewport, string][] = [
          ["sm", getBreakpoint("sm", "27em")],
          ["md", getBreakpoint("md", "45em")],
          ["lg", getBreakpoint("lg", "75em")],
          ["xl", getBreakpoint("xl", "125em")],
        ];
        const mqls = new Map<ContextMediaViewport, MediaQueryList>(
          breakpoints.map(([name, size]) => [
            name,
            matchMedia(`(min-width: ${size})`),
          ]),
        );
        const getViewport = (): ContextMediaViewport => {
          let viewport: ContextMediaViewport = "xs";
          for (const [name, mql] of mqls) if (mql.matches) viewport = name;
          return viewport;
        };
        return createSensor<ContextMediaViewport>(
          (set) => {
            const listener = () => {
              set(getViewport());
            };
            for (const mql of mqls.values())
              mql.addEventListener("change", listener);
            return () => {
              for (const mql of mqls.values())
                mql.removeEventListener("change", listener);
            };
          },
          { value: getViewport() },
        );
      })(),

      // Context for screen orientation
      orientation: createSensor<ContextMediaOrientation>(
        (set) => {
          const mql = matchMedia("(orientation: landscape)");
          const listener = (e: MediaQueryListEvent) => {
            set(e.matches ? "landscape" : "portrait");
          };
          mql.addEventListener("change", listener);
          return () => mql.removeEventListener("change", listener);
        },
        {
          value: matchMedia("(orientation: landscape)").matches
            ? "landscape"
            : "portrait",
        },
      ),
    });

    provideContexts(["motion", "theme", "viewport", "orientation"]);
  },
);

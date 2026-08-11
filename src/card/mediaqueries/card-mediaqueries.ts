import { bindText, defineComponent } from "@zeix/le-truc";
import {
  MEDIA_MOTION,
  MEDIA_ORIENTATION,
  MEDIA_THEME,
  MEDIA_VIEWPORT,
} from "../../context/media/context-media";

/**
 * Displays the current motion preference, color theme, viewport bucket, and
 * orientation, sourced from an ancestor `context-media` provider via
 * `requestContext()`. Demonstrates consuming context in a leaf component;
 * the host may contain any subset of `.motion`, `.theme`, `.viewport`,
 * `.orientation` elements — only those present are updated — and must be a
 * descendant of `<context-media>` to receive live values (each falls back
 * to the literal text `"unknown"` otherwise).
 *
 * @demo {https://zeixcom.github.io/le-truc/examples.html#card-mediaqueries} Interactive preview and usage examples
 */
export default defineComponent(
  "card-mediaqueries",
  ({ first, requestContext, watch }) => {
    const motionEl = first(".motion");
    if (motionEl) {
      const motion = requestContext(MEDIA_MOTION, "unknown");
      watch(motion, bindText(motionEl));
    }

    const themeEl = first(".theme");
    if (themeEl) {
      const theme = requestContext(MEDIA_THEME, "unknown");
      watch(theme, bindText(themeEl));
    }

    const viewportEl = first(".viewport");
    if (viewportEl) {
      const viewport = requestContext(MEDIA_VIEWPORT, "unknown");
      watch(viewport, bindText(viewportEl));
    }

    const orientationEl = first(".orientation");
    if (orientationEl) {
      const orientation = requestContext(MEDIA_ORIENTATION, "unknown");
      watch(orientation, bindText(orientationEl));
    }
  },
);

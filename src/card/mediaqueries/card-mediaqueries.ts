import { bindText, defineComponent } from "@zeix/le-truc";
import {
  MEDIA_MOTION,
  MEDIA_ORIENTATION,
  MEDIA_THEME,
  MEDIA_VIEWPORT,
} from "../../context/media/context-media";

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

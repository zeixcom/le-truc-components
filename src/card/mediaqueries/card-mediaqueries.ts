import { bindText, defineComponent } from "@zeix/le-truc";
import {
  MEDIA_MOTION,
  MEDIA_ORIENTATION,
  MEDIA_THEME,
  MEDIA_VIEWPORT,
} from "../../context/media/context-media";

type CardMediaqueriesPropKeys = "motion" | "theme" | "viewport" | "orientation";

export type CardMediaqueriesProps = Record<CardMediaqueriesPropKeys, string>;

declare global {
  interface HTMLElementTagNameMap {
    "card-mediaqueries": HTMLElement & CardMediaqueriesProps;
  }
}

export default defineComponent<CardMediaqueriesProps>(
  "card-mediaqueries",
  ({ expose, first, requestContext, watch }) => {
    const motionEl = first(".motion");
    const themeEl = first(".theme");
    const viewportEl = first(".viewport");
    const orientationEl = first(".orientation");

    expose({
      motion: requestContext(MEDIA_MOTION, "unknown"),
      theme: requestContext(MEDIA_THEME, "unknown"),
      viewport: requestContext(MEDIA_VIEWPORT, "unknown"),
      orientation: requestContext(MEDIA_ORIENTATION, "unknown"),
    });

    return [
      motionEl && watch("motion", bindText(motionEl, true)),
      themeEl && watch("theme", bindText(themeEl, true)),
      viewportEl && watch("viewport", bindText(viewportEl, true)),
      orientationEl && watch("orientation", bindText(orientationEl, true)),
    ];
  },
);

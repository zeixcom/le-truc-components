import { html, nothing, type TemplateResult } from "lit";

export type ContextMediaArgs = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  content: TemplateResult;
};

// Exported so other components' stories can embed a context-media provider
// via ${ContextMedia(args)} instead of duplicating its markup.
export const ContextMedia = ({
  sm,
  md,
  lg,
  xl,
  content,
}: ContextMediaArgs) => html`
  <context-media
    sm=${sm || nothing}
    md=${md || nothing}
    lg=${lg || nothing}
    xl=${xl || nothing}
  >
    ${content}
  </context-media>
`;

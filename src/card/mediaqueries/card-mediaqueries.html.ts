import { html } from "lit";

export type CardMediaqueriesArgs = {
  heading: string;
};

// Exported so other components' stories can embed a mediaqueries instance via
// ${CardMediaqueries(args)} instead of duplicating its markup.
export const CardMediaqueries = ({ heading }: CardMediaqueriesArgs) => html`
  <card-mediaqueries>
    <h2>${heading}</h2>
    <dl>
      <dt>Motion Preference:</dt>
      <dd class="motion"></dd>
      <dt>Theme Preference:</dt>
      <dd class="theme"></dd>
      <dt>Device Viewport:</dt>
      <dd class="viewport"></dd>
      <dt>Device Orientation:</dt>
      <dd class="orientation"></dd>
    </dl>
  </card-mediaqueries>
`;

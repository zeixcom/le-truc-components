import { html } from "lit";

export type CardColorscaleArgs = {
  value: string;
  label: string;
  size: "tiny" | "small" | "medium" | "large";
};

// Exported so other components' stories can embed a colorscale instance via
// ${Colorscale(args)} instead of duplicating its markup.
export const Colorscale = ({ value, label, size }: CardColorscaleArgs) => html`
  <card-colorscale class=${size} value=${value}>
    <ol role="presentation">
      <li class="lighten80"></li>
      <li class="lighten60"></li>
      <li class="lighten40"></li>
      <li class="lighten20"></li>
      <li class="base">
        <span class="label">
          <strong>${label}</strong>
          <small></small>
        </span>
      </li>
      <li class="darken20"></li>
      <li class="darken40"></li>
      <li class="darken60"></li>
      <li class="darken80"></li>
    </ol>
  </card-colorscale>
`;

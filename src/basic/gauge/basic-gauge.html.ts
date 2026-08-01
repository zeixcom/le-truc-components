import { html } from "lit";

export type BasicGaugeArgs = {
  value: number;
  thresholds: string;
  id?: string;
};

export const Gauge = ({
  value,
  thresholds,
  id = "basic-gauge-label",
}: BasicGaugeArgs) => html`
  <basic-gauge thresholds=${thresholds} value=${value}>
    <p id=${id}>Speed:</p>
    <meter
      class="visually-hidden"
      value=${value}
      aria-labelledby=${id}
    ></meter>
    <basic-number
      value=${value}
      options='{"style":"percent","maximumFractionDigits":1}'
      ></basic-number
    >
    <small class="label"></small>
  </basic-gauge>
`;

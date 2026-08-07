import { html } from "lit";
import { BasicNumber } from "../number/basic-number.html";

export type BasicGaugeArgs = {
  value: number;
  thresholds: string;
  id?: string;
};

export const BasicGauge = ({
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
    ${BasicNumber({
      value,
      options: '{"style":"percent","maximumFractionDigits":1}',
    })}
    <small class="label"></small>
  </basic-gauge>
`;

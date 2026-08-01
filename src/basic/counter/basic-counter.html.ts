import { html } from "lit";

export type BasicCounterArgs = {
  count: number;
};

export const Counter = ({ count }: BasicCounterArgs) => html`
  <basic-counter>
    <button type="button">💐 <span>${count}</span></button>
  </basic-counter>
`;

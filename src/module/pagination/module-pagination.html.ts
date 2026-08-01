import { html } from "lit";

export type ModulePaginationArgs = {
  value: number;
  max: number;
};

// Exported so other components' stories can embed a pagination instance via
// ${Pagination(args)} instead of duplicating its markup.
export const Pagination = ({ value, max }: ModulePaginationArgs) => html`
  <module-pagination>
    <div>
      <label>
        <span class="visually-hidden">Page</span>
        <input type="number" name="page" min="1" max=${max} value=${value} />
      </label>
      <span class="value visually-hidden" aria-current="page">${value}</span> of
      <span class="max">${max}</span>
    </div>
    <div class="buttons">
      <button type="button" class="prev" ?disabled=${value <= 1} aria-label="Previous page">❮</button>
      <button type="button" class="next" ?disabled=${value >= max} aria-label="Next page">❯</button>
    </div>
  </module-pagination>
`;

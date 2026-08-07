import { html, nothing } from "lit";

export type FormListboxArgs = {
  value?: string;
  filter?: string;
  src?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  // Own-story usage wraps the listbox in a <form> so its form participation
  // is exercisable in isolation; embedders that already provide a form (e.g.
  // form-combobox) opt out.
  wrapInForm?: boolean;
  // Whether aria-selected is derived from value — some embedders (e.g. the
  // combobox popup) don't mark a selected option until one is chosen.
  showSelected?: boolean;
};

// Exported so other components' stories can embed a listbox instance via
// ${FormListbox(args)} instead of duplicating its markup.
export const FormListbox = ({
  value,
  id = "colors",
  name = "color",
  ariaLabel = "Colors",
  ariaLabelledby,
  wrapInForm = true,
  showSelected = true,
}: FormListboxArgs) => {
  const isSelected = (option: string) =>
    showSelected && value === option ? "true" : nothing;
  const listbox = html`
    <form-listbox id=${id} name=${name || nothing}>
      <div
        role="listbox"
        aria-label=${ariaLabelledby ? nothing : ariaLabel}
        aria-labelledby=${ariaLabelledby || nothing}
      >
        <button type="button" role="option" tabindex="-1" value="red" aria-selected=${isSelected("red")}>Red</button>
        <button type="button" role="option" tabindex="-1" value="green" aria-selected=${isSelected("green")}>Green</button>
        <button type="button" role="option" tabindex="-1" value="blue" aria-selected=${isSelected("blue")}>Blue</button>
        <button type="button" role="option" tabindex="-1" value="yellow" aria-selected=${isSelected("yellow")}>Yellow</button>
        <button type="button" role="option" tabindex="-1" value="purple" aria-selected=${isSelected("purple")}>Purple</button>
      </div>
    </form-listbox>
  `;
  return wrapInForm ? html`<form>${listbox}</form>` : listbox;
};

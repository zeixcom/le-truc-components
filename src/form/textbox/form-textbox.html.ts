import { html, nothing } from "lit";

export type FormTextboxArgs = {
  value?: string;
  description?: string;
  clearable?: boolean;
  label?: string;
  // Full id of the native input; the description/error ids are derived by
  // stripping a trailing "-input" and appending "-description"/"-error".
  id?: string;
  name?: string;
  autocomplete?: string;
  placeholder?: string;
  required?: boolean;
  showError?: boolean;
  clearLabel?: string;
  // Extra class on the <form-textbox> host.
  hostClass?: string;
  // "name" attribute on the <form-textbox> host itself (distinct from the input's name).
  hostName?: string;
};

// Exported so other components' stories can embed a textbox instance via
// ${FormTextbox(args)} instead of duplicating its markup.
export const FormTextbox = ({
  value = "",
  description,
  clearable = false,
  label = "Name",
  id = "name-input",
  name = "name",
  autocomplete = "name",
  placeholder,
  required = true,
  showError = true,
  clearLabel = "Clear input",
  hostClass,
  hostName,
}: FormTextboxArgs) => {
  const idBase = id.replace(/-input$/, "");
  return html`
    <form-textbox class=${hostClass || nothing} name=${hostName || nothing}>
      <label for=${id}>${label}</label>
      <div class="input">
        <input
          type="text"
          id=${id}
          name=${name || nothing}
          autocomplete=${autocomplete || nothing}
          placeholder=${placeholder || nothing}
          ?required=${required}
          value=${value}
        />
        ${clearable ? html`<button type="button" class="clear" aria-label=${clearLabel} hidden>✕</button>` : nothing}
      </div>
      ${showError ? html`<p class="error" role="alert" aria-live="assertive" id=${`${idBase}-error`}></p>` : nothing}
      ${description !== undefined ? html`<p class="description" aria-live="polite" id=${`${idBase}-description`}>${description}</p>` : nothing}
    </form-textbox>
  `;
};

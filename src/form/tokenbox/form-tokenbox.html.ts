import { html, nothing } from "lit";

export type FormTokenboxArgs = {
  value?: string;
  description?: string;
  label?: string;
  // Full id of the native input; the description/error ids are derived by
  // stripping a trailing "-input" and appending "-description"/"-error".
  id?: string;
  // "name" attribute on the <form-tokenbox> host — the descendant input is
  // never named, since its value is only ever transient draft text, not the
  // committed tokens; ElementInternals (keyed on the host's name) is the
  // real submission path.
  name?: string;
  autocomplete?: string;
  placeholder?: string;
  inputType?: string;
  pattern?: string;
  showError?: boolean;
  // Extra class on the <form-tokenbox> host.
  hostClass?: string;
};

// Exported so other components' stories can embed a tokenbox instance via
// ${FormTokenbox(args)} instead of duplicating its markup.
export const FormTokenbox = ({
  value = "",
  description,
  label = "Tags",
  id = "tags-input",
  name = "tags",
  autocomplete = "off",
  placeholder,
  inputType = "text",
  pattern,
  showError = true,
  hostClass,
}: FormTokenboxArgs) => {
  const idBase = id.replace(/-input$/, "");
  return html`
    <form-tokenbox class=${hostClass || nothing} name=${name || nothing}>
      <label for=${id}>${label}</label>
      <div class="input" data-container>
        <input
          type=${inputType}
          id=${id}
          data-unreconciled
          autocomplete=${autocomplete || nothing}
          placeholder=${placeholder || nothing}
          pattern=${pattern || nothing}
          value=${value}
        />
      </div>
      <template>
        <span class="token" data-key>
          <span class="token-label"><slot></slot></span>
          <button type="button" class="remove" aria-label="Remove">✕</button>
        </span>
      </template>
      ${showError ? html`<p class="error" role="alert" aria-live="assertive" id=${`${idBase}-error`}></p>` : nothing}
      ${description !== undefined ? html`<p class="description" aria-live="polite" id=${`${idBase}-description`}>${description}</p>` : nothing}
      <p class="status visually-hidden" role="status" aria-live="polite"></p>
    </form-tokenbox>
  `;
};

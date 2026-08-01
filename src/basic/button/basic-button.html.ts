import { html, nothing } from "lit";

export type BasicButtonArgs = {
  label: string;
  badge: string;
  disabled: boolean;
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "constructive"
    | "destructive";
  size: "small" | "medium" | "large";
  content: "spans" | "text";
};

export const BasicButton = ({
  label,
  badge,
  disabled,
  variant,
  size,
  content,
}: BasicButtonArgs) => {
  const classes = [
    variant !== "secondary" ? variant : undefined,
    size !== "medium" ? size : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return html`
    <basic-button>
      <button
        type="button"
        class=${classes || nothing}
        ?disabled=${disabled}
      >${content === "text" ? label : html`<span class="label">${label}</span><span class="badge">${badge}</span>`}</button>
    </basic-button>
  `;
};

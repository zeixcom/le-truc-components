import { html, nothing } from "lit";

export type BasicButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "constructive"
  | "destructive";

export type BasicButtonArgs = {
  label: string;
  badge?: string;
  disabled?: boolean;
  variant?: BasicButtonVariant | BasicButtonVariant[];
  size?: "small" | "medium" | "large";
  content?: "spans" | "text";
  // Native button type — "submit" for buttons embedded in a <form>.
  type?: "button" | "submit";
  // Extra class on the <basic-button> host, used by parent components as a selector.
  hostClass?: string;
  ariaLabel?: string;
  ariaHaspopup?: string;
  ariaControls?: string;
  // Read by module-codeblock's copy-to-clipboard button via getAttribute.
  copySuccess?: string;
  copyError?: string;
};

export const BasicButton = ({
  label,
  badge = "",
  disabled = false,
  variant,
  size = "medium",
  content = "spans",
  type = "button",
  hostClass,
  ariaLabel,
  ariaHaspopup,
  ariaControls,
  copySuccess,
  copyError,
}: BasicButtonArgs) => {
  const variants = (
    Array.isArray(variant) ? variant : variant ? [variant] : []
  ).filter((v) => v !== "secondary");
  const classes = [...variants, size !== "medium" ? size : undefined]
    .filter(Boolean)
    .join(" ");
  return html`
    <basic-button
      class=${hostClass || nothing}
      copy-success=${copySuccess || nothing}
      copy-error=${copyError || nothing}
    >
      <button
        type=${type}
        class=${classes || nothing}
        ?disabled=${disabled}
        aria-label=${ariaLabel || nothing}
        aria-haspopup=${ariaHaspopup || nothing}
        aria-controls=${ariaControls || nothing}
      >${content === "text" ? label : html`<span class="label">${label}</span><span class="badge">${badge}</span>`}</button>
    </basic-button>
  `;
};

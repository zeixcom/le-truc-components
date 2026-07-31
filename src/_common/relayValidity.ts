import type { FormAssociatedElement } from "@zeix/le-truc";

/* === Types === */

/**
 * Minimal write-handle for a reactive error string. Matches the `.set()` shape
 * of a `cause-effect` `State<string>` without taking a runtime dependency on
 * the signal primitive.
 */
type ErrorSink = { set(value: string): void };

/* === Exported Functions === */

/**
 * Relay an inner native form control's validity to the host and the inline
 * error display in one step.
 *
 * - Runs `checkValidity()` on the inner control so the browser recomputes its
 *   `validationMessage` from native constraints (required, pattern, etc.).
 * - Mirrors that message into the component-internal error signal, which the
 *   inline `.error` element binds to.
 * - Forwards it to `host.setCustomValidity()` so external consumers see native
 *   parity (`host.validity`, `host.validationMessage`, `:user-invalid`).
 *
 * @param input - The inner native form control driving validity
 * @param host - The form-associated host element
 * @param error - A write-handle (e.g. a `State<string>`) for the inline error
 */
export const relayValidity = (
  input: HTMLInputElement | HTMLTextAreaElement,
  host: FormAssociatedElement,
  error: ErrorSink,
): void => {
  input.checkValidity();
  const msg = input.validationMessage ?? "";
  error.set(msg);
  host.setCustomValidity(msg);
};

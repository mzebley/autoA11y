/**
 * Returns true for keys that should activate a control (Space or Enter).
 * Useful for non-button triggers that borrow button semantics.
 */
export function isActivateKey(evt: KeyboardEvent) {
  return evt.key === " " || evt.key === "Enter";
}

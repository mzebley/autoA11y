/** Ensure `el.id` is present; assign with the given prefix if absent. */
export function ensureId(el: HTMLElement, prefix: string) {
  if (!el.id) {
    const uuid =
      typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function"
        ? (crypto as any).randomUUID()
        : Math.random().toString(36).slice(2);
    el.id = `${prefix}-${uuid}`;
  }
  return el.id;
}

/** Convenience setter for `aria-expanded` string boolean. */
export function setAriaExpanded(el: HTMLElement, expanded: boolean) {
  el.setAttribute("aria-expanded", expanded ? "true" : "false");
}

/** Convenience setter for `aria-hidden` string boolean. */
export function setAriaHidden(el: HTMLElement, hidden: boolean) {
  el.setAttribute("aria-hidden", hidden ? "true" : "false");
}

/** Add a unique whitespace-separated token to an attribute value. */
export function appendToken(el: Element, attr: string, token: string) {
  const existing = el.getAttribute(attr);
  const tokens = new Set((existing ?? "").split(/\s+/).filter(Boolean));
  tokens.add(token);
  el.setAttribute(attr, Array.from(tokens).join(" "));
  return tokens;
}

/** Remove a token from a whitespace-separated attribute value. */
export function removeToken(el: Element, attr: string, token: string) {
  const existing = el.getAttribute(attr);
  if (!existing) return;
  const tokens = existing.split(/\s+/).filter(Boolean).filter(value => value !== token);
  if (tokens.length) el.setAttribute(attr, tokens.join(" "));
  else el.removeAttribute(attr);
}

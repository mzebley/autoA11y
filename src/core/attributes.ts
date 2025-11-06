export function ensureId(el: HTMLElement, prefix: string) {
  if (!el.id) {
    el.id = `${prefix}-${crypto.randomUUID()}`;
  }
  return el.id;
}

export function setAriaExpanded(el: HTMLElement, expanded: boolean) {
  el.setAttribute("aria-expanded", expanded ? "true" : "false");
}

export function setAriaHidden(el: HTMLElement, hidden: boolean) {
  el.setAttribute("aria-hidden", hidden ? "true" : "false");
}

export function appendToken(el: Element, attr: string, token: string) {
  const existing = el.getAttribute(attr);
  const tokens = new Set((existing ?? "").split(/\s+/).filter(Boolean));
  tokens.add(token);
  el.setAttribute(attr, Array.from(tokens).join(" "));
  return tokens;
}

export function removeToken(el: Element, attr: string, token: string) {
  const existing = el.getAttribute(attr);
  if (!existing) return;
  const tokens = existing.split(/\s+/).filter(Boolean).filter(value => value !== token);
  if (tokens.length) el.setAttribute(attr, tokens.join(" "));
  else el.removeAttribute(attr);
}

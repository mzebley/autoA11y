// Shared ARIA helpers (placeholder for future expansion)
export function setIfAbsent(el: HTMLElement, name: string, value: string) {
  if (!el.hasAttribute(name)) el.setAttribute(name, value);
}
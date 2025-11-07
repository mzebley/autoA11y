/**
 * Set an attribute only if it is currently absent on the element.
 * Avoids clobbering author-provided values while providing safe defaults.
 */
export function setIfAbsent(el: HTMLElement, name: string, value: string) {
  if (!el.hasAttribute(name)) el.setAttribute(name, value);
}

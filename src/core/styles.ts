import { setAriaHidden } from "./attributes";

/**
 * Synchronize DOM `hidden` with `aria-hidden` to ensure assistive tech parity.
 * Use for show/hide operations on targets controlled by patterns.
 */
export function setHiddenState(el: HTMLElement, hidden: boolean) {
  el.hidden = hidden;
  setAriaHidden(el, hidden);
}

/**
 * Apply or remove the `inert` attribute in a consistent way.
 * Used by modal/dialog flows to stack-interactability of background content.
 */
export function setInert(el: HTMLElement, inert: boolean) {
  if (inert) {
    el.setAttribute("inert", "");
  } else {
    el.removeAttribute("inert");
  }
}

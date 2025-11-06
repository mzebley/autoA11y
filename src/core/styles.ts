import { setAriaHidden } from "./attributes";

export function setHiddenState(el: HTMLElement, hidden: boolean) {
  el.hidden = hidden;
  setAriaHidden(el, hidden);
}

export function setInert(el: HTMLElement, inert: boolean) {
  if (inert) {
    el.setAttribute("inert", "");
  } else {
    el.removeAttribute("inert");
  }
}

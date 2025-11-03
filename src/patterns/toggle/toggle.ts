import { getClassConfig, applyClasses } from "@core/classes";

export function initToggle(trigger: Element) {
  if (!(trigger instanceof HTMLElement)) return;

  const targetSel = trigger.getAttribute("data-autoa11y-toggle");
  if (!targetSel) return;
  const target = document.querySelector<HTMLElement>(targetSel);
  if (!target) return;

  const cfg = getClassConfig(trigger);

  if (!trigger.id) trigger.id = `autoa11y-t-${crypto.randomUUID()}`;
  if (!target.id) target.id = `autoa11y-p-${crypto.randomUUID()}`;

  trigger.setAttribute("aria-controls", target.id);
  trigger.setAttribute("aria-expanded", "false");
  target.setAttribute("aria-labelledby", trigger.id);
  target.hidden = true;

  if (trigger.tagName !== "BUTTON") {
    trigger.setAttribute("role", "button");
    if (!trigger.hasAttribute("tabindex")) (trigger as HTMLElement).tabIndex = 0;
    if (!(trigger as HTMLElement).style.cursor) (trigger as HTMLElement).style.cursor = "pointer";
  }

  applyClasses(cfg, false, trigger, target);

  const setState = (open: boolean) => {
    trigger.setAttribute("aria-expanded", String(open));
    target.hidden = !open;
    applyClasses(cfg, open, trigger, target);
    trigger.dispatchEvent(new CustomEvent("autoa11y:toggle", { detail: { expanded: open, trigger, target } }));
  };

  const toggle = () => setState(trigger.getAttribute("aria-expanded") !== "true");

  trigger.addEventListener("click", toggle);
  trigger.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
  });

  trigger.dispatchEvent(new CustomEvent("autoa11y:ready", { detail: { trigger, target } }));
}
import { getClassConfig, applyClasses } from "@core/classes";
import { dispatch } from "@core/events";

const HIDE_DELAY_MS = 100;

/**
 * Hydrates a tooltip trigger so hover/focus displays the referenced tooltip target.
 * Expects `data-automagica11y-tooltip` to resolve to the tooltip element.
 */
export function initTooltip(trigger: Element) {
  if (!(trigger instanceof HTMLElement)) return;

  const selector = trigger.getAttribute("data-automagica11y-tooltip");
  if (!selector) return;

  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  // Ensure tooltip has a stable ID so aria-describedby can reference it.
  if (!target.id) target.id = `automagica11y-tip-${crypto.randomUUID()}`;

  // Preserve any existing aria-describedby values and append the tooltip ID.
  const describedBy = new Set(
    (trigger.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
  );
  describedBy.add(target.id);
  trigger.setAttribute("aria-describedby", Array.from(describedBy).join(" "));

  // Baseline tooltip semantics.
  if (!target.hasAttribute("role")) target.setAttribute("role", "tooltip");
  target.setAttribute("aria-hidden", "true");
  target.hidden = true;

  // Snapshot class mappings. Tooltip does not apply default toggle classes.
  const cfg = getClassConfig(trigger, { applyTriggerFallback: false });

  let expanded = false;
  let pointerActive = false;
  let focusActive = false;
  let hideTimer: number | null = null;

  const clearHideTimer = () => {
    if (hideTimer !== null) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const setState = (open: boolean) => {
    if (expanded === open) return;
    expanded = open;
    target.hidden = !open;
    target.setAttribute("aria-hidden", open ? "false" : "true");
    applyClasses(cfg, open, trigger, target);
    dispatch(trigger, "automagica11y:toggle", { expanded: open, trigger, target });
  };

  const show = () => {
    clearHideTimer();
    setState(true);
  };

  const scheduleHide = () => {
    clearHideTimer();
    if (pointerActive || focusActive) return;
    hideTimer = window.setTimeout(() => {
      hideTimer = null;
      if (!pointerActive && !focusActive) setState(false);
    }, HIDE_DELAY_MS);
  };

  const pointerEnter = () => {
    pointerActive = true;
    show();
  };

  const pointerLeave = () => {
    pointerActive = false;
    scheduleHide();
  };

  trigger.addEventListener("pointerenter", pointerEnter);
  trigger.addEventListener("pointerleave", pointerLeave);
  target.addEventListener("pointerenter", pointerEnter);
  target.addEventListener("pointerleave", pointerLeave);

  trigger.addEventListener("focus", () => {
    focusActive = true;
    show();
  });

  trigger.addEventListener("blur", () => {
    focusActive = false;
    scheduleHide();
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      focusActive = false;
      pointerActive = false;
      clearHideTimer();
      setState(false);
    }
  });

  dispatch(trigger, "automagica11y:ready", { trigger, target });
}

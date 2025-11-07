import { createClassToggler } from "@core/classes";
import { ensureId, setAriaExpanded, setAriaHidden } from "@core/attributes";
import { dispatch } from "@core/events";
import { setHiddenState, setInert } from "@core/styles";
import { createFocusTrap, focusElement } from "@core/focus";

type BackgroundSnapshot = {
  el: HTMLElement;
  ariaHidden: string | null;
  inert: boolean;
};

interface DialogController {
  registerTrigger(trigger: HTMLElement): void;
  toggle(trigger: HTMLElement): void;
  close(trigger?: HTMLElement | null, restoreFocus?: boolean): void;
}

const controllers = new WeakMap<HTMLElement, DialogController>();

function ensureDialogController(target: HTMLElement): DialogController {
  const existing = controllers.get(target);
  if (existing) return existing;

  ensureId(target, "automagica11y-dialog");
  if (!target.hasAttribute("role")) target.setAttribute("role", "dialog");
  target.setAttribute("aria-modal", "true");
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  setHiddenState(target, true);

  const classTogglers = new Map<HTMLElement, ReturnType<typeof createClassToggler>>();
  const triggers = new Set<HTMLElement>();
  const backgroundState: BackgroundSnapshot[] = [];

  let open = false;
  let activeTrigger: HTMLElement | null = null;
  let previousFocus: HTMLElement | null = null;
  let previousOverflow: string | null = null;

  const getClassToggle = (trigger: HTMLElement) => {
    let toggler = classTogglers.get(trigger);
    if (!toggler) {
      toggler = createClassToggler(trigger);
      classTogglers.set(trigger, toggler);
    }
    return toggler;
  };

  const applyTriggerState = (trigger: HTMLElement, expanded: boolean) => {
    setAriaExpanded(trigger, expanded);
    getClassToggle(trigger)(expanded, target);
  };

  const lockBackgroundScroll = () => {
    const body = document.body;
    previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    body.classList.add("modal-open");
  };

  const restoreBackgroundScroll = () => {
    const body = document.body;
    if (previousOverflow !== null) {
      body.style.overflow = previousOverflow;
    } else {
      body.style.removeProperty("overflow");
    }
    body.classList.remove("modal-open");
    previousOverflow = null;
  };

  const inertBackground = () => {
    backgroundState.length = 0;
    const root = document.documentElement;

    const inerted = new Set<HTMLElement>();

    const mark = (el: HTMLElement) => {
      if (el === target || inerted.has(el)) return;
      inerted.add(el);
      backgroundState.push({
        el,
        ariaHidden: el.getAttribute("aria-hidden"),
        inert: el.hasAttribute("inert")
      });
      setAriaHidden(el, true);
      if (!el.hasAttribute("inert")) setInert(el, true);
    };

    const markSiblings = (node: HTMLElement | null) => {
      const parent = node?.parentElement;
      if (!parent) return;
      Array.from(parent.children).forEach((sibling) => {
        if (!(sibling instanceof HTMLElement)) return;
        if (sibling === node) return;
        mark(sibling);
      });
      markSiblings(parent);
    };

    Array.from(root.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      if (child === target || child.contains(target)) return;
      mark(child);
    });

    markSiblings(target);
  };

  const restoreBackground = () => {
    backgroundState.forEach(({ el, ariaHidden, inert }) => {
      if (ariaHidden === null) el.removeAttribute("aria-hidden");
      else el.setAttribute("aria-hidden", ariaHidden);
      if (!inert) setInert(el, false);
    });
    backgroundState.length = 0;
  };

  const focusTrap = createFocusTrap(target);

  const handleFocusIn = (event: FocusEvent) => {
    if (!open) return;
    focusTrap.handleFocusIn(event);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      controller.close();
    } else {
      focusTrap.handleKeydown(event);
    }
  };

  const handleTargetClick = (event: MouseEvent) => {
    const targetEl = event.target as HTMLElement | null;
    if (!targetEl) return;

    const closer = targetEl.closest("[data-automagica11y-dialog-close]");
    if (closer && target.contains(closer)) {
      event.preventDefault();
      controller.close();
      return;
    }

    if (targetEl === target && target.hasAttribute("data-automagica11y-dialog-dismissable")) {
      event.preventDefault();
      controller.close();
    }
  };

  const openDialog = (source: HTMLElement) => {
    if (open && activeTrigger === source) {
      controller.close(source);
      return;
    }

    if (open && activeTrigger && activeTrigger !== source) {
      controller.close(activeTrigger, false);
    }

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeTrigger = source;
    open = true;

    applyTriggerState(source, true);
    lockBackgroundScroll();
    inertBackground();

    setHiddenState(target, false);

    queueMicrotask(() => focusTrap.focusFirst());

    dispatch(source, "automagica11y:toggle", { expanded: true, trigger: source, target });
  };

  const closeDialog = (source?: HTMLElement | null, restoreFocus = true) => {
    if (!open) return;

    let closingTrigger: HTMLElement | null = null;
    if (source instanceof HTMLElement) closingTrigger = source;
    else if (activeTrigger instanceof HTMLElement) closingTrigger = activeTrigger;
    else {
      const first = Array.from(triggers)[0];
      closingTrigger = first instanceof HTMLElement ? first : null;
    }
    const focusReturn =
      previousFocus instanceof HTMLElement && previousFocus !== document.body
        ? previousFocus
        : (closingTrigger instanceof HTMLElement ? closingTrigger : activeTrigger);

    if (closingTrigger instanceof HTMLElement) {
      applyTriggerState(closingTrigger, false);
    }

    open = false;
    activeTrigger = null;
    previousFocus = null;

    setHiddenState(target, true);

    restoreBackground();
    restoreBackgroundScroll();

    if (closingTrigger instanceof HTMLElement) {
      dispatch(closingTrigger, "automagica11y:toggle", { expanded: false, trigger: closingTrigger, target });
    }

    if (restoreFocus === true && focusReturn !== null && typeof focusReturn.focus === "function") {
      queueMicrotask(() => focusElement(focusReturn));
    }
  };

  const toggleDialog = (trigger: HTMLElement) => {
    if (open) closeDialog(trigger);
    else openDialog(trigger);
  };

  const handleTriggerClick = (event: Event) => {
    event.preventDefault();
    const trigger = event.currentTarget as HTMLElement;
    toggleDialog(trigger);
  };

  const handleTriggerKeydown = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      const trigger = event.currentTarget as HTMLElement;
      toggleDialog(trigger);
    }
  };

  const registerTrigger = (trigger: HTMLElement) => {
    if (triggers.has(trigger)) return;
    triggers.add(trigger);

    trigger.setAttribute("aria-controls", target.id);
    trigger.setAttribute("aria-haspopup", "dialog");
    applyTriggerState(trigger, false);

    trigger.addEventListener("click", handleTriggerClick);
    trigger.addEventListener("keydown", handleTriggerKeydown);
  };

  target.addEventListener("click", handleTargetClick);
  document.addEventListener("focusin", handleFocusIn, true);
  document.addEventListener("keydown", handleKeydown, true);

  const controller: DialogController = {
    registerTrigger,
    toggle: toggleDialog,
    close: closeDialog
  };

  controllers.set(target, controller);
  return controller;
}

/**
 * Hydrates a dialog trigger so it opens/closes its associated modal target with accessible defaults.
 * Expects `data-automagica11y-dialog` to resolve to the dialog container.
 */
export function initDialog(trigger: Element) {
  if (!(trigger instanceof HTMLElement)) return;
  const selector = trigger.getAttribute("data-automagica11y-dialog");
  if (!selector) return;

  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  const controller = ensureDialogController(target);
  controller.registerTrigger(trigger);

  dispatch(trigger, "automagica11y:ready", { trigger, target });
}

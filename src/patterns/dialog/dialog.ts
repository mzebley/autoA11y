import { createClassToggler } from "@core/classes";
import { ensureId, setAriaExpanded, setAriaHidden } from "@core/attributes";
import { dispatch } from "@core/events";
import { setHiddenState, setInert } from "@core/styles";

type BackgroundSnapshot = {
  el: HTMLElement;
  ariaHidden: string | null;
  inert: boolean;
};

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(", ");

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
  let previousFocus: Element | null = null;
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

  const focusableElements = () =>
    Array.from(target.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );

  const focusFirstElement = () => {
    const focusables = focusableElements();
    const first = focusables[0] ?? target;
    if (typeof first.focus === "function") {
      first.focus();
    }
  };

  const trapTabKey = (event: KeyboardEvent) => {
    const focusables = focusableElements();
    if (!focusables.length) {
      event.preventDefault();
      target.focus();
      return;
    }

    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
    if (event.shiftKey) {
      event.preventDefault();
      const prevIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
      focusables[prevIndex].focus();
    } else {
      event.preventDefault();
      const nextIndex = currentIndex === -1 || currentIndex === focusables.length - 1 ? 0 : currentIndex + 1;
      focusables[nextIndex].focus();
    }
  };

  const lockBackgroundScroll = () => {
    if (!document.body) return;
    previousOverflow = document.body.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
  };

  const restoreBackgroundScroll = () => {
    if (!document.body) return;
    if (previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
    } else {
      document.body.style.removeProperty("overflow");
    }
    document.body.classList.remove("modal-open");
    previousOverflow = null;
  };

  const inertBackground = () => {
    backgroundState.length = 0;
    const root = document.body ?? document.documentElement;
    if (!root) return;

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

  const focusWithinDialog = (event: FocusEvent) => {
    if (!open) return;
    if (!target.contains(event.target as Node)) {
      focusFirstElement();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      controller.close();
    } else if (event.key === "Tab") {
      trapTabKey(event);
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

    window.setTimeout(() => focusFirstElement(), 0);

    dispatch(source, "automagica11y:toggle", { expanded: true, trigger: source, target });
  };

  const closeDialog = (source?: HTMLElement | null, restoreFocus = true) => {
    if (!open) return;

    const closingTrigger = source ?? activeTrigger ?? Array.from(triggers)[0] ?? null;
    const focusReturn =
      previousFocus instanceof HTMLElement && previousFocus !== document.body
        ? previousFocus
        : closingTrigger ?? activeTrigger ?? null;

    if (closingTrigger) {
      applyTriggerState(closingTrigger, false);
    }

    open = false;
    activeTrigger = null;
    previousFocus = null;

    setHiddenState(target, true);

    restoreBackground();
    restoreBackgroundScroll();

    if (closingTrigger) {
      dispatch(closingTrigger, "automagica11y:toggle", { expanded: false, trigger: closingTrigger, target });
    }

    if (restoreFocus && focusReturn && typeof focusReturn.focus === "function") {
      window.setTimeout(() => focusReturn.focus(), 0);
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
  document.addEventListener("focusin", focusWithinDialog, true);
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

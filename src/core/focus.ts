export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(", ");

function isVisible(element: HTMLElement) {
  if (element.hasAttribute("hidden")) return false;
  const ariaHidden = element.getAttribute("aria-hidden");
  if (ariaHidden === "true") return false;
  if (element.offsetParent !== null) return true;
  if (element.offsetWidth > 0 || element.offsetHeight > 0) return true;
  if (typeof element.getClientRects === "function" && element.getClientRects().length > 0) return true;
  // Fallback for environments without layout (e.g., JSDOM)
  return true;
}

export function isFocusable(element: HTMLElement) {
  if (element.hasAttribute("disabled")) return false;
  if (element.getAttribute("aria-hidden") === "true") return false;
  if (!isVisible(element)) return false;
  if (element.matches(FOCUSABLE_SELECTOR)) return true;
  return element.tabIndex >= 0;
}

export function getFocusableIn(root: ParentNode | Element): HTMLElement[] {
  const result: HTMLElement[] = [];

  const pushIfFocusable = (el: Element | null) => {
    if (el instanceof HTMLElement && isFocusable(el) && !result.includes(el)) {
      result.push(el);
    }
  };

  if (root instanceof Element) {
    pushIfFocusable(root);
  }

  if ("querySelectorAll" in root) {
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR).forEach(pushIfFocusable);
  }

  return result;
}

export interface FocusOptionsExtended {
  preventScroll?: boolean;
  preserveTabIndex?: boolean;
}

export function focusElement(element: HTMLElement, options: FocusOptionsExtended = {}) {
  const { preventScroll = true, preserveTabIndex = true } = options;

  const restore = preserveTabIndex ? preserveTabIndexFn(element) : () => {};

  try {
    element.focus({ preventScroll });
  } catch {
    element.focus();
  }

  if (preserveTabIndex) {
    element.addEventListener(
      "blur",
      () => {
        restore();
      },
      { once: true }
    );
  }
}

function preserveTabIndexFn(element: HTMLElement) {
  const hadAttr = element.hasAttribute("tabindex");
  const previousValue = element.getAttribute("tabindex");
  const needsTemp = element.tabIndex < 0 && !element.matches(FOCUSABLE_SELECTOR);
  if (!needsTemp) {
    return () => {};
  }
  element.tabIndex = -1;
  return () => {
    if (hadAttr && previousValue !== null) {
      element.setAttribute("tabindex", previousValue);
    } else if (hadAttr && previousValue === null) {
      element.removeAttribute("tabindex");
    } else {
      element.removeAttribute("tabindex");
    }
  };
}

export function focusFirst(root: ParentNode | Element, options?: FocusOptionsExtended) {
  const focusables = getFocusableIn(root);
  const first = focusables[0];
  if (first) {
    focusElement(first, options);
    return first;
  }
  if (root instanceof HTMLElement) {
    focusElement(root, options);
    return root;
  }
  return null;
}

export interface FocusTrap {
  focusFirst: () => void;
  handleFocusIn: (event: FocusEvent) => void;
  handleKeydown: (event: KeyboardEvent) => void;
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  const getCycleList = () => {
    const list = getFocusableIn(container);
    if (list.length > 1 && list[0] === container) {
      return list.slice(1);
    }
    return list;
  };

  const focusFirstInTrap = () => {
    const list = getCycleList();
    if (list.length) {
      focusElement(list[0]);
    } else {
      focusElement(container);
    }
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!container.contains(event.target as Node)) {
      focusFirstInTrap();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const focusables = getCycleList();
    if (!focusables.length) {
      event.preventDefault();
      focusElement(container);
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusables.indexOf(active) : -1;

    if (event.shiftKey) {
      event.preventDefault();
      if (currentIndex <= 0) {
        focusElement(focusables[focusables.length - 1]);
      } else {
        focusElement(focusables[currentIndex - 1]);
      }
    } else {
      event.preventDefault();
      if (currentIndex === -1 || currentIndex === focusables.length - 1) {
        focusElement(focusables[0]);
      } else {
        focusElement(focusables[currentIndex + 1]);
      }
    }
  };

  return {
    focusFirst: focusFirstInTrap,
    handleFocusIn,
    handleKeydown
  };
}

export interface FocusOrderController {
  release: () => void;
}

export interface FocusOrderOptions {
  startIndex?: number;
  relativeTo?: HTMLElement | null;
}

export function applyFocusOrder(elements: HTMLElement[], options: FocusOrderOptions = {}): FocusOrderController | null {
  if (!elements.length) return null;

  const originals = new Map<HTMLElement, string | null>();
  const { startIndex, relativeTo } = options;

  let baseIndex: number;
  if (typeof startIndex === "number" && !Number.isNaN(startIndex)) {
    baseIndex = Math.max(1, Math.floor(startIndex));
  } else if (relativeTo instanceof HTMLElement && relativeTo.tabIndex > 0) {
    baseIndex = relativeTo.tabIndex + 1;
  } else {
    baseIndex = 1;
  }

  let index = baseIndex;

  elements.forEach((element) => {
    if (!originals.has(element)) {
      originals.set(element, element.hasAttribute("tabindex") ? element.getAttribute("tabindex") : null);
    }
    element.tabIndex = index++;
  });

  return {
    release() {
      originals.forEach((value, element) => {
        if (value === null || value === undefined) {
          element.removeAttribute("tabindex");
        } else {
          element.setAttribute("tabindex", value);
        }
      });
    }
  };
}

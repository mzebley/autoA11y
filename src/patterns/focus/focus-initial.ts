import { focusElement } from "@core/focus";

const initialized = new WeakSet<HTMLElement>();

export function initFocusInitial(node: Element) {
  if (!(node instanceof HTMLElement)) return;
  if (initialized.has(node)) return;
  initialized.add(node);

  const delayAttr = node.getAttribute("data-automagica11y-focus-delay");
  const delay = delayAttr ? Number(delayAttr) : 0;
  const preventScroll = node.getAttribute("data-automagica11y-focus-prevent-scroll") !== "false";

  const run = () => {
    focusElement(node, { preventScroll, preserveTabIndex: true });
  };

  if (delay > 0) {
    window.setTimeout(run, delay);
  } else {
    queueMicrotask(run);
  }
}

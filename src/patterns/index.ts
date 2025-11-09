import { registerPattern } from "@core/registry";
import { initContextTrigger } from "./shared/context";
import { initToggle, isToggleOpen, getToggleTarget } from "./toggle/toggle";
import { initTooltip } from "./tooltip/tooltip";
import { initPopover } from "./popover/popover";
import { initDialog } from "./dialog/dialog";
import { initFocusInitial } from "./focus/focus-initial";
import { initFocusMap } from "./focus/focus-map";
export { registerAnnouncePlugin } from "../plugins/announce/announce";

// Register the generic context pattern first so it can promote
// `data-automagica11y-target` into `data-automagica11y-toggle`
// before the toggle pattern hydrates.
registerPattern("context", "[data-automagica11y-context]", (node) => {
  if (node instanceof Element) {
    initContextTrigger(node);
  }
});

registerPattern("toggle", "[data-automagica11y-toggle]", (node) => {
  if (node instanceof Element) {
    initToggle(node);
  }
});

registerPattern("tooltip", "[data-automagica11y-tooltip]", (node) => {
  if (node instanceof Element) {
    initTooltip(node);
  }
});

registerPattern("popover", "[data-automagica11y-popover]", (node) => {
  if (node instanceof Element) {
    initPopover(node);
  }
});

registerPattern("dialog", "[data-automagica11y-dialog]", (node) => {
  if (node instanceof Element) {
    initDialog(node);
  }
});

registerPattern("focus-initial", "[data-automagica11y-focus-initial]", (node) => {
  if (node instanceof Element) {
    initFocusInitial(node);
  }
});

registerPattern("focus-map", "[data-automagica11y-focus-map]", (node) => {
  if (node instanceof Element) {
    initFocusMap(node);
  }
});

export {
  initToggle,
  isToggleOpen,
  getToggleTarget,
  initTooltip,
  initPopover,
  initDialog,
  initFocusInitial,
  initFocusMap,
};

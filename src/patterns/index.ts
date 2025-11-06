import { registerPattern } from "@core/registry";
import { initToggle } from "./toggle/toggle";
import { initTooltip } from "./tooltip/tooltip";
import { initDialog } from "./dialog/dialog";
export { registerAnnouncePlugin } from "./announce/announce";

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

registerPattern("dialog", "[data-automagica11y-dialog]", (node) => {
  if (node instanceof Element) {
    initDialog(node);
  }
});

export { initToggle, initTooltip, initDialog };

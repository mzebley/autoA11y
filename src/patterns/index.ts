import { registerPattern } from "@core/registry";
import { initToggle } from "./toggle/toggle";
import { initTooltip } from "./tooltip/tooltip";
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

export { initToggle, initTooltip };

export * from "@core/registry";
export * from "./patterns";
export { registerAnnouncePlugin } from "./plugins/announce/announce";
export { registerAnimatePlugin } from "./plugins/animate/animate";

import { initAllPatterns } from "@core/registry";
if (typeof window !== "undefined") {
  initAllPatterns(document);
}

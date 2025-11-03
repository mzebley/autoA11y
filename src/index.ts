export * from "@core/registry";
export * from "./patterns";

// Auto-initialize all patterns when running in a browser.
import { initAllPatterns } from "@core/registry";
if (typeof window !== "undefined") {
  initAllPatterns(document);
}

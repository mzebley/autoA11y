import { registerPattern } from "@core/registry";
import { initToggle } from "./toggle/toggle";

registerPattern("toggle", "[data-autoa11y-toggle]", initToggle);

export { initToggle };

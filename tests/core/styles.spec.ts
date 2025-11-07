import { describe, it, expect } from "vitest";
import { setHiddenState, setInert } from "../../src/core/styles";

describe("core/styles", () => {
  it("syncs hidden with aria-hidden", () => {
    const el = document.createElement("div");
    setHiddenState(el, true);
    expect(el.hidden).toBe(true);
    expect(el.getAttribute("aria-hidden")).toBe("true");
    setHiddenState(el, false);
    expect(el.hidden).toBe(false);
    expect(el.getAttribute("aria-hidden")).toBe("false");
  });

  it("sets and removes inert attribute", () => {
    const el = document.createElement("section");
    setInert(el, true);
    expect(el.hasAttribute("inert")).toBe(true);
    setInert(el, false);
    expect(el.hasAttribute("inert")).toBe(false);
  });
});


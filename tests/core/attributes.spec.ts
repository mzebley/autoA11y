import { describe, it, expect, vi } from "vitest";
import { ensureId, setAriaExpanded, setAriaHidden, appendToken, removeToken } from "../../src/core/attributes";

describe("core/attributes", () => {
  it("ensures id with prefix when absent", () => {
    const el = document.createElement("div");
    const id = ensureId(el, "pref");
    expect(id.startsWith("pref-")).toBe(true);
    expect(el.id).toBe(id);
    // does not overwrite existing id
    el.id = "given";
    expect(ensureId(el, "pref")).toBe("given");
  });

  it("sets aria-expanded and aria-hidden", () => {
    const el = document.createElement("div");
    setAriaExpanded(el, true);
    expect(el.getAttribute("aria-expanded")).toBe("true");
    setAriaHidden(el, false);
    expect(el.getAttribute("aria-hidden")).toBe("false");
  });

  it("appends and removes tokens", () => {
    const el = document.createElement("div");
    appendToken(el, "data-tags", "a");
    appendToken(el, "data-tags", "b");
    appendToken(el, "data-tags", "a");
    expect(el.getAttribute("data-tags")).toBe("a b");
    removeToken(el, "data-tags", "a");
    expect(el.getAttribute("data-tags")).toBe("b");
    removeToken(el, "data-tags", "b");
    expect(el.hasAttribute("data-tags")).toBe(false);
  });
});

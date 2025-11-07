import { describe, it, expect } from "vitest";
import { isActivateKey } from "../../src/core/keyboard";

describe("core/keyboard", () => {
  it("identifies activation keys", () => {
    expect(isActivateKey(new KeyboardEvent("keydown", { key: "Enter" }))).toBe(true);
    expect(isActivateKey(new KeyboardEvent("keydown", { key: " " }))).toBe(true);
    expect(isActivateKey(new KeyboardEvent("keydown", { key: "Escape" }))).toBe(false);
  });
});


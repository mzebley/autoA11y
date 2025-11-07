import { describe, it, expect } from "vitest";
import { resolveAnchoredPlacement } from "../../src/core/placement";

describe("resolveAnchoredPlacement cross-axis guards", () => {
  it("falls back to a side placement when top/bottom would overflow horizontally", () => {
    // Viewport dimensions
    const measure = {
      viewportWidth: () => 320,
      viewportHeight: () => 600,
    };

    // Trigger near the right edge of the viewport
    const trigger = document.createElement("button");
    (trigger as any).getBoundingClientRect = () =>
      ({
        width: 30,
        height: 30,
        top: 200,
        left: 280,
        right: 310,
        bottom: 230,
        x: 280,
        y: 200,
        toJSON() { return this; },
      } as DOMRect);

    // Surface wider than the horizontal half-space, so centered top/bottom would overflow
    const surface = document.createElement("div");
    (surface as any).getBoundingClientRect = () =>
      ({
        width: 200,
        height: 80,
        top: 0,
        left: 0,
        right: 200,
        bottom: 80,
        x: 0,
        y: 0,
        toJSON() { return this; },
      } as DOMRect);

    const placement = resolveAnchoredPlacement(trigger, surface, "bottom", measure);

    // Not top/bottom; should resolve to the side with space (left in this setup)
    expect(["left", "right"]).toContain(placement);
    expect(placement).toBe("left");
  });
});


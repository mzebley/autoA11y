import { describe, it, expect, beforeEach, vi } from "vitest";
import { initAllPatterns } from "../../src/core/registry";
import "../../src/patterns";

function pointer(type: string, pointerType = "mouse") {
  const event = new Event(type, { bubbles: true, cancelable: true });
  try {
    Object.defineProperty(event, "pointerType", { value: pointerType });
  } catch {
    // noop for environments that freeze event properties
  }
  return event as PointerEvent;
}

describe("context pattern", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("hydrates tooltip via context+target", () => {
    document.body.innerHTML = `
      <button id="t" data-automagica11y-context="tooltip" data-automagica11y-target="#tip">Info</button>
      <span id="tip" role="tooltip" hidden>Helpful</span>
    `;

    const trigger = document.getElementById("t") as HTMLElement;
    const tip = document.getElementById("tip") as HTMLElement;

    vi.useFakeTimers();
    initAllPatterns(document);

    // aria-describedby should be wired and tooltip hidden initially
    const describedby = trigger.getAttribute("aria-describedby") ?? "";
    expect(describedby.split(/\s+/)).toContain(tip.id);
    expect(tip.hidden).toBe(true);

    // pointerenter should show immediately (default open delay 0)
    trigger.dispatchEvent(pointer("pointerenter"));
    vi.advanceTimersByTime(0);
    expect(tip.hidden).toBe(false);

    // escape should hide
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip.hidden).toBe(true);
    vi.useRealTimers();
  });

  it("falls back to next sibling when target not provided", () => {
    document.body.innerHTML = `
      <button id="t" data-automagica11y-context="tooltip">Info</button>
      <span role="tooltip" hidden>Helpful</span>
    `;

    const trigger = document.getElementById("t") as HTMLElement;
    const tip = trigger.nextElementSibling as HTMLElement;

    initAllPatterns(document);

    const describedby = trigger.getAttribute("aria-describedby") ?? "";
    expect(describedby.split(/\s+/)).toContain(tip.id);
  });
});


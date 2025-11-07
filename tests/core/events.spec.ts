import { describe, it, expect } from "vitest";
import { dispatch } from "../../src/core/events";

describe("core/events", () => {
  it("bubbles and is composed by default", () => {
    const root = document.createElement("div");
    const child = document.createElement("button");
    root.appendChild(child);

    let seen = false;
    root.addEventListener("automagica11y:test", () => { seen = true; });

    const evt = dispatch(child, "automagica11y:test", { ok: true });
    expect(seen).toBe(true);
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
    expect(evt.cancelable).toBe(false);
  });

  it("supports cancelable events", () => {
    const btn = document.createElement("button");
    btn.addEventListener("automagica11y:cancelable", (e) => e.preventDefault());
    const evt = dispatch(btn, "automagica11y:cancelable", {}, { cancelable: true });
    expect(evt.cancelable).toBe(true);
    expect(evt.defaultPrevented).toBe(true);
  });
});


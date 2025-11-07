import { describe, it, expect } from "vitest";
import { getClassConfig, applyClasses, createClassToggler } from "../../src/core/classes";

describe("core/classes", () => {
  it("parses truthy/falsy class hooks from data attributes", () => {
    const trigger = document.createElement("button");
    trigger.setAttribute("data-automagica11y-trigger-class-open", "is-open");
    trigger.setAttribute("data-automagica11y-target-class-closed", "is-closed");
    const cfg = getClassConfig(trigger);
    expect(cfg.trigger.true).toContain("is-open");
    expect(cfg.target.false).toContain("is-closed");
  });

  it("applies classes for expanded and collapsed states", () => {
    const trigger = document.createElement("button");
    const target = document.createElement("div");
    trigger.setAttribute("data-automagica11y-trigger-class-open", "on");
    trigger.setAttribute("data-automagica11y-trigger-class-closed", "off");
    // Target class hooks are configured on the trigger
    trigger.setAttribute("data-automagica11y-target-class-open", "visible");
    trigger.setAttribute("data-automagica11y-target-class-closed", "hidden");
    const cfg = getClassConfig(trigger);
    applyClasses(cfg, true, trigger, target);
    expect(trigger.classList.contains("on")).toBe(true);
    expect(target.classList.contains("visible")).toBe(true);
    applyClasses(cfg, false, trigger, target);
    expect(trigger.classList.contains("off")).toBe(true);
    expect(target.classList.contains("hidden")).toBe(true);
  });

  it("creates a toggler function bound to a trigger", () => {
    const trigger = document.createElement("button");
    const target = document.createElement("div");
    trigger.setAttribute("data-automagica11y-trigger-class-open", "a");
    trigger.setAttribute("data-automagica11y-target-class-open", "b");
    const toggle = createClassToggler(trigger);
    toggle(true, target);
    expect(trigger.classList.contains("a")).toBe(true);
    expect(target.classList.contains("b")).toBe(true);
  });
});

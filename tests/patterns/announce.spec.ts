import { describe, expect, it, beforeEach, vi } from "vitest";

const loadAnnounce = async () => import("../../src/patterns/announce/announce");

const dispatchToggle = (trigger: HTMLElement, detail: Record<string, unknown>) => {
  trigger.dispatchEvent(
    new CustomEvent("autoa11y:toggle", {
      bubbles: true,
      detail
    })
  );
};

describe("announce pattern", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useRealTimers();
    document.body.innerHTML = "";
    const liveRegion = document.getElementById("autoa11y-live");
    liveRegion?.remove();
  });

  it("creates a singleton live region on registration", async () => {
    const { registerAnnouncePlugin } = await loadAnnounce();
    expect(document.getElementById("autoa11y-live")).toBeNull();

    registerAnnouncePlugin();

    const region = document.getElementById("autoa11y-live");
    expect(region).toBeTruthy();
    expect(region?.getAttribute("role")).toBe("status");
    expect(region?.getAttribute("aria-live")).toBe("polite");
  });

  it("announces custom open text when provided", async () => {
    document.body.innerHTML = `
      <button
        data-autoa11y-toggle="#panel"
        data-autoa11y-announce="polite"
        data-autoa11y-announce-open="FAQ expanded"
        data-autoa11y-announce-closed="FAQ collapsed">
        FAQ
      </button>
      <div id="panel"></div>
    `;

    const { registerAnnouncePlugin } = await loadAnnounce();
    registerAnnouncePlugin();

    const trigger = document.querySelector("[data-autoa11y-announce]") as HTMLElement;
    const target = document.getElementById("panel") as HTMLElement;

    vi.useFakeTimers();
    dispatchToggle(trigger, { expanded: true, trigger, target });
    vi.advanceTimersByTime(50);

    const region = document.getElementById("autoa11y-live");
    expect(region?.textContent).toBe("FAQ expanded");
  });

  it("falls back to accessible name when custom text is absent", async () => {
    document.body.innerHTML = `
      <button
        aria-label="Primary panel"
        data-autoa11y-toggle="#panel"
        data-autoa11y-announce="assertive">
        Hidden text
      </button>
      <div id="panel"></div>
    `;

    const { registerAnnouncePlugin } = await loadAnnounce();
    registerAnnouncePlugin();

    const trigger = document.querySelector("[data-autoa11y-announce]") as HTMLElement;
    const target = document.getElementById("panel") as HTMLElement;

    vi.useFakeTimers();
    dispatchToggle(trigger, { expanded: false, trigger, target });
    vi.advanceTimersByTime(50);

    const region = document.getElementById("autoa11y-live");
    expect(region?.textContent).toBe("Primary panel collapsed");
    expect(region?.getAttribute("aria-live")).toBe("assertive");
    expect(region?.getAttribute("role")).toBe("alert");
  });

  it("skips announcements when the trigger retains focus", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Focusable";
    trigger.setAttribute("data-autoa11y-announce", "polite");
    trigger.setAttribute("data-autoa11y-toggle", "#panel");
    document.body.appendChild(trigger);
    const target = document.createElement("div");
    target.id = "panel";
    document.body.appendChild(target);

    const { registerAnnouncePlugin } = await loadAnnounce();
    registerAnnouncePlugin();

    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    vi.useFakeTimers();
    dispatchToggle(trigger, { expanded: true, trigger, target });
    vi.advanceTimersByTime(50);

    const region = document.getElementById("autoa11y-live");
    expect(region?.textContent).toBe("");
  });
});

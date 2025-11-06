import { describe, it, expect, beforeEach, vi } from "vitest";
import { initFocusInitial } from "../../src/patterns/focus/focus-initial";
import { initFocusMap } from "../../src/patterns/focus/focus-map";

describe("focus patterns", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.activeElement && (document.activeElement as HTMLElement).blur?.();
    vi.useRealTimers();
  });

  it("focuses an element marked with data-automagica11y-focus-initial", async () => {
    document.body.innerHTML = `
      <div>
        <button id="primary" data-automagica11y-focus-initial>Primary</button>
        <button id="secondary">Secondary</button>
      </div>
    `;

    const primary = document.getElementById("primary") as HTMLElement;
    initFocusInitial(primary);
    await Promise.resolve();

    expect(document.activeElement).toBe(primary);
  });

  it("applies a focus map order across selectors", () => {
    document.body.innerHTML = `
      <button id="before">Before</button>
      <div id="anchor" tabindex="0"></div>
      <section id="scope">
        <button id="player">Player</button>
        <a id="nav1" href="#">Nav1</a>
        <a id="nav2" href="#">Nav2</a>
        <button id="cta">CTA</button>
      </section>
      <button id="after">After</button>
    `;

    const anchor = document.getElementById("anchor") as HTMLElement;
    anchor.setAttribute("data-automagica11y-focus-map", "#nav1; #nav2; #player; #cta");
    anchor.setAttribute("data-automagica11y-focus-map-scope", "#scope");
    anchor.setAttribute("data-automagica11y-focus-map-anchor", "#anchor");
    initFocusMap(anchor);

    const nav1El = document.getElementById("nav1") as HTMLElement;
    const nav2El = document.getElementById("nav2") as HTMLElement;
    const playerEl = document.getElementById("player") as HTMLElement;
    const ctaEl = document.getElementById("cta") as HTMLElement;

    anchor.focus();
    anchor.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(nav1El);

    nav1El.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(nav2El);

    nav2El.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(playerEl);

    playerEl.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(ctaEl);

    const exitEvent = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    ctaEl.dispatchEvent(exitEvent);
    expect(exitEvent.defaultPrevented).toBe(false);
    ctaEl.blur();
    (document.getElementById("after") as HTMLElement).focus();

    const reverseEvent = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    nav1El.dispatchEvent(reverseEvent);
    expect(reverseEvent.defaultPrevented).toBe(true);
  });
});

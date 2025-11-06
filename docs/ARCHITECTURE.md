# automagicA11y Architecture

This document explains how **automagicA11y** is structured internally and how its modular registry and helper systems work.

---

## Overview

automagicA11y follows a modular design where each **pattern** (toggle today, tooltip/dialog planned) is self-contained but shares core utilities for:

- Class management
- ARIA attribute wiring
- Event emission
- Keyboard handling

This architecture ensures that:

- Patterns don't conflict
- Core utilities are reusable and consistent
- New patterns can be added without touching existing code

---

## Registry System

The **registry** is the backbone that keeps patterns independent but coordinated.

```ts
registerPattern(name: string, selector: string, initFn: (el: Element) => void)
```

- Each pattern registers itself with a name and a selector (e.g., `[data-automagica11y-toggle]`).
- `initAllPatterns()` runs through the registry and initializes all registered selectors in the document or given root.

This allows you to dynamically load only the patterns you want, or initialize specific sections of a page.

---

## Helpers

### `classes.ts`

Handles class toggling and **truthiness mapping**.

- Reads `data-automagica11y-[trigger|target]-class-[action]` attributes.
- Maps synonyms (`open`, `expanded`, `active`, etc.) to true/false.
- Applies/removes appropriate classes from both trigger and target.

### `aria.ts`

Lightweight helper for applying ARIA attributes only when missing. (Currently a single utility with room to grow.)

### `keyboard.ts`

Holds shared keyboard affordance helpers such as `isActivateKey()`. Additional helpers will land alongside new patterns.

### `events.ts`

Wrapper for dispatching typed custom events. Future patterns can build on this instead of re-implementing dispatch logic.

---

## Lifecycle Events

Every component dispatches consistent lifecycle events:

- `automagica11y:ready` — after setup
- `automagica11y:toggle` — whenever state changes

The announce pattern is the canonical listener for these events. Once `registerAnnouncePlugin()` runs, a shared live region responds to hooks like `automagica11y:toggle`. Future patterns (dialogs, accordions, menus) will emit the same events so announce can announce their state transitions without creating new live regions.

---

## Pattern Isolation

Each pattern registers against its own selector. Today that means the toggle pattern, and upcoming patterns (tooltip, dialog, etc.) will follow the same convention.
All patterns share the same attribute naming grammar (trigger/target/class/action) but register separately via the registry.

This ensures no collisions and predictable initialization order.

---

## Adding a New Pattern

1. Create a new folder under `src/patterns/` (e.g., `menu/`).
2. Create a pattern init function: `initMenu(trigger: HTMLElement)`.
3. Register it in `src/patterns/index.ts`:

   ```ts
   registerPattern("menu", "[data-automagica11y-menu]", initMenu);
   ```

4. Use shared helpers (e.g., `getClassConfig()`, `applyClasses()`).
5. Add examples and tests.
6. Done.

# Plugin Concepts

automagicA11y aims to keep the core tiny and let optional behaviors layer on as needed. Today that means a single shipped plugin (announce) with more specialized plugins planned once patterns expand.

---

## Current Plugin — Announce (Cross-cutting)

### Description

Shared live region that centralizes screen reader announcements for any pattern that emits `automagica11y:*` events.

### Usage

```ts
import { registerAnnouncePlugin } from "automagica11y";

registerAnnouncePlugin();
```

Add `data-automagica11y-announce` to a trigger to opt in:

```html
<button
  data-automagica11y-toggle="#details"
  data-automagica11y-announce="polite"
  data-automagica11y-announce-open="Details expanded"
  data-automagica11y-announce-closed="Details collapsed">
  Toggle details
</button>
```

### Features

- Singleton polite live region (assertive opt-in via `data-automagica11y-announce="assertive"`)
- Consumes trigger data attributes for custom messages
- Generates sensible defaults from accessible names
- Suppresses duplicate messages and skips redundant focused updates

---

## Planned Plugins (Roadmap)

### 1. Persist Plugin

Remembers open state using localStorage or sessionStorage.

```html
data-automagica11y-persist="local"
```

### 2. Hash Plugin

Synchronizes toggle state with the URL hash (deep-linking).

### 3. Animate Plugin

Delays hiding until CSS transition ends; respects `prefers-reduced-motion`.

### 4. Inert Plugin

Applies/removes `inert` attribute on non-active content areas for modals or dialogs.

---

## Future API Shape

As additional plugins materialize, the plan is to expose a lightweight hook system (for example, `registerPlugin(name, hooks)`) so cross-cutting behaviors can subscribe to pattern lifecycle events without manual wiring. That API is still in exploration.

---

© 2025 Mark Zebley • automagicA11y  
_Licensed under the MIT License_
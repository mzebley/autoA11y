# Announce Pattern (`data-autoa11y-announce`)

> _Shared live region messaging for every pattern._

The **Announce Pattern** centralizes screen reader updates across all autoA11y components. Instead of each pattern managing its own live region, authors opt in per trigger using data attributes while a single plugin handles ARIA live output.

---

## When to Use

- You need consistent spoken feedback when toggles, dialogs, or future patterns change state.
- You want localized/custom messaging without duplicating announce logic.
- You prefer declarative configuration over imperative announcement code.

---

## Quick Start

1. Import and register the announce plugin once during boot:

```ts
import { registerAnnouncePlugin } from "autoa11y";

registerAnnouncePlugin();
```

2. Opt individual triggers into announcements:

```html
<button
  data-autoa11y-toggle="#details"
  data-autoa11y-announce="polite"
  data-autoa11y-announce-open="Details expanded"
  data-autoa11y-announce-closed="Details collapsed">
  Toggle details
</button>
```

---

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-autoa11y-announce` | Enables announcements and sets delivery mode (`polite` default, `assertive` optional). |
| `data-autoa11y-announce-open` | Custom message when the control opens. |
| `data-autoa11y-announce-closed` | Custom message when the control closes. |

If open/closed messages are omitted, the plugin derives sensible defaults using the trigger's accessible name (aria-label, aria-labelledby, or text content) plus `"expanded"`/`"collapsed"`.

---

## Behavior Summary

- Creates a singleton live region (`aria-live="polite"`, `role="status"`) on first use.
- Debounces identical messages for 750 ms to avoid chatter.
- Skips announcements when the trigger remains focused (screen readers already vocalize `aria-expanded` changes).
- Falls back to polite delivery unless `data-autoa11y-announce="assertive"` is supplied.
- Listens for `autoa11y:toggle` events emitted by patterns such as `data-autoa11y-toggle`.

---

## Event Integration

Any pattern that dispatches `autoa11y:toggle` automatically integrates with announce. Future patterns should emit similar events (e.g., `autoa11y:dialog`) so the plugin can announce their state transitions without additional wiring.

---

## Tips

- Keep custom messages short and action-oriented (e.g., “FAQ expanded” instead of “The FAQ section has now opened fully.”).
- When localizing, provide both open and closed strings to avoid mixing languages with the default English verbs.
- Use polite mode for routine updates; reserve `assertive` for urgent content like warnings or errors.

---

## Related Docs

| Document | Description |
|-----------|-------------|
| [Attribute Grammar](../../../docs/attributes.md) | How data-autoa11y attributes are structured |
| [Truthiness Mapping](../../../docs/truthiness.md) | Synonym mapping for state terms |
| [Plugins](../../../docs/plugins.md) | Extend functionality (persist, announce, animate, etc.) |
| [Architecture](../../../docs/ARCHITECTURE.md) | Internal registry and helper system overview |

---

© 2025 Mark Zebley • autoA11y  
_Licensed under the MIT License_

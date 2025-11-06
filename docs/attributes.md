# Attribute Grammar

automagicA11y uses a predictable, declarative attribute structure. Toggle/disclosure ships today, and upcoming patterns (tooltip, dialog, etc.) will reuse the same grammar.

```text
data-automagica11y-[element]-[affordance]-[action]
```

| Part | Description | Examples |
|------|--------------|-----------|
| `element` | The item being manipulated (`trigger` or `target`) | `data-automagica11y-trigger-*` |
| `affordance` | What’s being controlled (`class`, `attr`, `style`) | `data-automagica11y-trigger-class-open` |
| `action` | The resulting state (`open`, `closed`, etc.) | `data-automagica11y-target-class-closed` |

---

## Examples

### Toggle Example

```html
<button data-automagica11y-toggle="#faq1" data-automagica11y-trigger-class-open="btn-active" data-automagica11y-trigger-class-closed="btn-inactive">
  FAQ
</button>
<div id="faq1">...</div>
```

### Tooltip Example

```html
<button data-automagica11y-tooltip="#tip1" data-automagica11y-trigger-class-open="hovering">
  Hover me
</button>
<span id="tip1" role="tooltip">Tooltip text</span>
```

---

## Grammar Benefits

- **Consistency** — one pattern for all features
- **Discoverability** — developers can infer attributes by name
- **Scalability** — easy to extend with `-attr-` or `-style-` affordances later

---

© 2025 Mark Zebley • automagicA11y  
_Licensed under the MIT License_

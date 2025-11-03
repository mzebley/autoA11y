# Toggle Pattern (`data-autoa11y-toggle`)

> _Drop an attribute. Get the ARIA._

The **Toggle Pattern** (sometimes called “Disclosure”) is the foundational pattern in **autoA11y**.  
It provides accessible, keyboard-operable toggling behavior for showing and hiding content — no extra JavaScript authoring required.

---

## Overview

A toggle consists of two elements:

1. A **trigger** — the interactive element the user clicks or activates.  
2. A **target** — the content that is shown or hidden.

The trigger declares its target using the `data-autoa11y-toggle="#targetId"` attribute.  
autoA11y handles the rest: wiring up ARIA attributes, managing visibility, and syncing class names to reflect open or closed states.

```html
<button data-autoa11y-toggle="#faq1">More details</button>
<div id="faq1">Hidden content</div>
```

When initialized, autoA11y automatically:

- Adds `aria-controls` and `aria-expanded`  
- Applies `aria-labelledby` to the target  
- Hides the target by default (`hidden = true`)  
- Enables Space/Enter keyboard activation  
- Dispatches lifecycle events you can listen for  

---

## Accessible Defaults

| Element | Behavior |
|----------|-----------|
| **Trigger** | Receives `aria-controls` + `aria-expanded` |
| **Target** | Receives `aria-labelledby` |
| **Non-button trigger** | Gets `role="button"`, `tabindex="0"`, and pointer cursor |

ARIA and keyboard affordances are handled automatically to ensure compliance with WCAG and ARIA Authoring Practices.

---

## Example with Classes

```html
<button
  data-autoa11y-toggle="#info"
  data-autoa11y-trigger-class-open="btn--active"
  data-autoa11y-trigger-class-closed="btn--ghost"
  data-autoa11y-target-class-open="panel--visible"
  data-autoa11y-target-class-closed="panel--hidden">
  Info
</button>

<div id="info" hidden>More information...</div>
```

When the button is toggled **open**, autoA11y:

- Sets `aria-expanded="true"`  
- Removes `hidden` from the target  
- Adds `.btn--active` to the trigger  
- Adds `.panel--visible` to the target  

When toggled **closed**, these revert automatically.

---

## Attribute Reference

| Attribute | Description |
|------------|-------------|
| `data-autoa11y-toggle` | Selector (ID or class) of the target element. **Required.** |
| `data-autoa11y-trigger-class-[state]` | Classes to apply to the trigger for each state (`open`, `closed`, `active`, `inactive`, etc.). |
| `data-autoa11y-target-class-[state]` | Classes to apply to the target element for each state. |
| `data-autoa11y-group` | (Future) Groups multiple toggles as an accordion. |
| `data-autoa11y-persist` | (Plugin) Remembers state using localStorage/sessionStorage. |
| `data-autoa11y-hash` | (Plugin) Syncs state with URL hash. |
| `data-autoa11y-animate` | (Plugin) Delays hiding for CSS transitions. |

---

## Truthiness Mapping

autoA11y understands multiple synonyms for “open” and “closed” states.  
The toggle pattern uses a **truthiness mapping** to normalize them internally.

| Truthy (open) | Falsy (closed) |
|---------------|----------------|
| open | closed |
| expanded | collapsed |
| shown | hidden |
| active | inactive |
| pressed | unpressed |
| true | false |
| on | off |

This means that `data-autoa11y-target-class-expanded` and `data-autoa11y-target-class-active` behave identically.

---

## Lifecycle Events

Each initialized toggle dispatches the following events:

| Event | When it fires |
|--------|----------------|
| `autoa11y:ready` | Once the toggle has been initialized and is ready for use |
| `autoa11y:toggle` | Whenever the toggle changes state |
| `autoa11y:open` | When expanded |
| `autoa11y:close` | When collapsed |

Example:

```js
document.addEventListener("autoa11y:toggle", (e) => {
  const { expanded, trigger, target } = e.detail;
  console.log(expanded ? "Opened" : "Closed", trigger, target);
});
```

---

## Keyboard Support

- **Enter** and **Space** toggle the target (for non-button triggers).  
- Focus remains on the trigger to match ARIA disclosure behavior.  
- `tabindex="0"` is automatically added when needed.

---

## Authoring Notes

- The trigger and target **must** have unique IDs — autoA11y generates them if missing.  
- The target is hidden by default (`hidden = true`).  
- You can style `[hidden]` or `[aria-expanded="true"]` for transitions.  
- To integrate with CSS animations, use the upcoming `animate` plugin.

---

## Customization via Data Attributes

Developers can define as many custom class mappings as they want:

```html
<div
  data-autoa11y-toggle="#panel"
  data-autoa11y-trigger-class-active="highlight"
  data-autoa11y-trigger-class-inactive="muted"
  data-autoa11y-target-class-expanded="visible"
  data-autoa11y-target-class-collapsed="hidden">
  Toggle Panel
</div>

<section id="panel" hidden>Panel content here.</section>
```

The truthiness system will resolve each class set to the appropriate true/false state automatically.

---

## Event Detail Structure

Every dispatched event includes a `detail` payload:

```ts
{
  expanded: boolean;  // true if open
  trigger: HTMLElement;
  target: HTMLElement;
}
```

This structure makes it simple to integrate with frameworks, custom logic, or analytics.

---

## Default Styles

```css
.a11y-toggled-open {}
.a11y-toggled-closed {}
.a11y-target-open {}
.a11y-target-closed {}

[hidden] {
  display: none !important;
}
```

These classes are automatically managed by autoA11y and can be overridden or replaced with your own using `data-autoa11y-*` attributes.

---

## Integration Tips

- Manually initialize toggles with `initToggle(element)`.  
- The registry auto-initializes all `[data-autoa11y-toggle]` elements on load.  
- To extend behavior (persistence, announcements, animations), use or register a plugin.

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

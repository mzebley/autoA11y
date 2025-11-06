# Pattern Status

automagicA11y patterns are small, self-contained behaviors that automatically handle ARIA attributes, keyboard controls, and class/state reflection. This document tracks what ships today versus what is on the roadmap.

---

## Available Today

### Toggle / Disclosure (v0.1)

**Description:** Foundational component for show/hide interactions. Manages `aria-expanded`, `aria-controls`, open/closed truthiness mapping, and class reflection.

**Highlights:**
- Works with buttons and non-button triggers.
- Generates trigger IDs, ARIA relationships, and keyboard semantics automatically.
- Emits `automagica11y:ready` and `automagica11y:toggle` events.
- Supports declarative class mapping with synonym-aware data attributes.

---

### Tooltip (v0.2)

**Description:** Hover/focus tooltip that wires `aria-describedby`, `role="tooltip"`, and manages visibility automatically.

**Highlights:**
- Hides the tooltip by default and toggles `aria-hidden`.
- Shows on pointer enter or focus; hides on blur, pointer leave (with a short delay), or Escape.
- Keeps the tooltip visible while pointer rests on either trigger or tooltip content.
- Reuses class mapping attributes without applying toggle-specific defaults.
- Emits `automagica11y:ready`/`automagica11y:toggle` so announce or custom listeners can respond.

---

## In Development

### Dialog (target release v0.2)

**Goal:** Accessible modal system with `aria-modal`, focus trapping, and inert background management.

**Planned features:**
- `data-automagica11y-dialog` trigger binding.
- Background `inert` toggling.
- ESC-to-close and focus restoration.

### Accordion (target release v0.3)

**Goal:** Grouped toggle pattern that builds on the existing toggle logic.

**Planned features:**
- `data-automagica11y-group` attribute for mutual exclusion.
- Arrow-key navigation between triggers.
- Optional “only one open” mode.

### Menu / Disclosure Menu (target release v0.3+)

**Goal:** Dropdown/disclosure menu following the ARIA Menu Button pattern.

**Planned features:**
- Keyboard arrow navigation and proper menu roles.
- Escape key close behavior.
- Optional hover activation.

---

© 2025 Mark Zebley • automagicA11y  
_Licensed under the MIT License_

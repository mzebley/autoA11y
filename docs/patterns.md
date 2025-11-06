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

## In Development

### Tooltip (target release v0.2)

**Goal:** Handle hover/focus interactions using `aria-describedby` and `role="tooltip"`.

**Planned features:**
- Hover/focus open, blur/mouseleave close.
- `data-automagica11y-tooltip` target selector.
- Automatic ARIA role assignment.
- Optional delay timers for friendlier UX.

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

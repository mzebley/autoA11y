// Auto-initialize automagica11y across the docs site in dev and build.
// The library initializes patterns on import, so this ensures demos work
// without relying on per-playground dynamic imports.
import * as a11y from 'automagica11y';

// Expose the library on window so docs playgrounds can reinit without
// performing additional dynamic imports (avoids dev console noise).
declare global {
  interface Window {
    automagica11y?: typeof a11y;
  }
}

window.automagica11y = a11y;

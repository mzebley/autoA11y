const OPPOSITE: Record<AnchoredPlacement, AnchoredPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const DEFAULT_ORDER: AnchoredPlacement[] = ["bottom", "top", "right", "left"];

export type AnchoredPlacement = "top" | "bottom" | "left" | "right";

export type PreferredAnchoredPlacement = AnchoredPlacement | "auto";

export interface AnchoredPlacementMeasureConfig {
  viewportWidth(): number;
  viewportHeight(): number;
}

const DEFAULT_MEASURE: AnchoredPlacementMeasureConfig = {
  viewportWidth: () => {
    const w = window.innerWidth;
    return Number.isFinite(w) && w > 0 ? w : document.documentElement.clientWidth;
  },
  viewportHeight: () => {
    const h = window.innerHeight;
    return Number.isFinite(h) && h > 0 ? h : document.documentElement.clientHeight;
  },
};

/**
 * Determine the best placement for an anchored surface (tooltip, popover, etc.).
 * Prefers the requested placement, but will fall back to the opposite side or
 * a sensible default whenever the surface would overflow the viewport.
 */
export function resolveAnchoredPlacement(
  trigger: HTMLElement,
  surface: HTMLElement,
  preferred: PreferredAnchoredPlacement,
  measure: AnchoredPlacementMeasureConfig = DEFAULT_MEASURE,
): AnchoredPlacement {
  const triggerRect = trigger.getBoundingClientRect();
  const surfaceRect = surface.getBoundingClientRect();

  const viewportWidth = measure.viewportWidth();
  const viewportHeight = measure.viewportHeight();

  const order = buildOrder(preferred);

  for (const placement of order) {
    if (fits(placement, triggerRect, surfaceRect, viewportWidth, viewportHeight)) {
      return placement;
    }
  }

  return order[0];
}

function buildOrder(preferred: PreferredAnchoredPlacement): AnchoredPlacement[] {
  if (preferred === "auto") {
    return [...DEFAULT_ORDER];
  }

  const fallback = OPPOSITE[preferred];
  return [preferred, fallback, ...DEFAULT_ORDER.filter((place) => place !== preferred && place !== fallback)];
}

function fits(
  placement: AnchoredPlacement,
  triggerRect: DOMRect,
  surfaceRect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  // Cross‑axis clamp: for top/bottom we should also ensure the surface
  // will not overflow horizontally when centered on the trigger; for
  // left/right we similarly guard the vertical axis. This keeps the
  // anchored surface on‑screen more reliably near viewport edges.
  const centerX = triggerRect.left + triggerRect.width / 2;
  const leftSpace = centerX; // space from center to the left edge
  const rightSpace = viewportWidth - centerX; // to right edge
  const halfWidthFits = surfaceRect.width / 2 <= Math.min(leftSpace, rightSpace);

  const centerY = triggerRect.top + triggerRect.height / 2;
  const topSpace = centerY;
  const bottomSpace = viewportHeight - centerY;
  const halfHeightFits = surfaceRect.height / 2 <= Math.min(topSpace, bottomSpace);

  switch (placement) {
    case "top":
      return surfaceRect.height <= triggerRect.top && halfWidthFits;
    case "bottom":
      return (
        surfaceRect.height <= viewportHeight - (triggerRect.top + triggerRect.height) &&
        halfWidthFits
      );
    case "left":
      return surfaceRect.width <= triggerRect.left && halfHeightFits;
    case "right":
      return (
        surfaceRect.width <= viewportWidth - (triggerRect.left + triggerRect.width) &&
        halfHeightFits
      );
    default:
      return true;
  }
}

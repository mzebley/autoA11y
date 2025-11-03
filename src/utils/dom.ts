// DOM helpers (placeholder)
export function $(root: ParentNode, sel: string): HTMLElement | null {
  return root.querySelector(sel);
}
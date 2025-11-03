// Event helpers (placeholder)
export function dispatch(target: HTMLElement, type: string, detail: any) {
  target.dispatchEvent(new CustomEvent(type, { detail }));
}
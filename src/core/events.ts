// Event helpers (placeholder)
export function dispatch<TDetail>(target: HTMLElement, type: string, detail: TDetail) {
  target.dispatchEvent(new CustomEvent<TDetail>(type, { detail }));
}

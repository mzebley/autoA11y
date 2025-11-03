// ID helpers (placeholder)
export function autoId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
import { vi } from "vitest";

// Provide a deterministic crypto.randomUUID for environments (like JSDOM) that lack it.
if (typeof globalThis.crypto === "undefined") {
  (globalThis as any).crypto = {};
}

if (typeof globalThis.crypto.randomUUID !== "function") {
  let counter = 0;
  const fallback = (): `${string}-${string}-${string}-${string}-${string}` => {
    const suffix = counter.toString(16).padStart(12, "0");
    counter += 1;
    return `00000000-0000-4000-8000-${suffix}` as `${string}-${string}-${string}-${string}-${string}`;
  };
  globalThis.crypto.randomUUID = vi.fn(fallback) as unknown as Crypto["randomUUID"];
}

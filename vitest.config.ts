import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@patterns": path.resolve(__dirname, "src/patterns")
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    clearMocks: true
  }
});

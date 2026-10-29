import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         "@": path.resolve(import.meta.dirname, "./src"),
      },
   },
   test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: "./src/test/setup.ts",
   },
});

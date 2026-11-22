import { defineConfig } from "vite";
declare const process: { env: Record<string, string | undefined> };
// GitHub Pages serves this repo under /clams-have-feelings-too/ — the Pages
// workflow sets PAGES_BASE so asset URLs resolve there. Local dev, the VM
// preview and Cursor app hosting all serve from /, so base stays "/" there.
export default defineConfig({
  base: process.env.PAGES_BASE ?? "/",
  test: { environment: "node" },
} as never);

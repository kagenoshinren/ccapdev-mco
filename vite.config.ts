import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    devtools(),
    tanstackStart({ router: { generatedRouteTree: "./route-tree.gen.ts" } }),
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
  ],
  ssr: { noExternal: ["@mantine/*"] },
});

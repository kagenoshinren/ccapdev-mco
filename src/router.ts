import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./route-tree.gen.ts";

// oxlint-disable-next-line typescript/explicit-function-return-type
export const getRouter = () => createRouter({ defaultPreload: "intent", routeTree, scrollRestoration: true });

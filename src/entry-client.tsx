import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter, createHashHistory } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const queryClient = new QueryClient();

function RoutePending() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-background/50 backdrop-blur-sm z-50">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}

const router = createRouter({
  routeTree,
  context: { queryClient },
  history: createHashHistory(),
  defaultPendingComponent: RoutePending,
  defaultPendingMs: 0,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

document.getElementById("initial-loader")?.remove();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

import { Layout } from "@/components/Layout";
import { ManagePage } from "@/pages/ManagePage";
import { MapPage } from "@/pages/MapPage";
import { RequestsPage } from "@/pages/RequestsPage";
import { RoutePage } from "@/pages/RoutePage";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MapPage,
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
  }),
});

const routePlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/route",
  component: RoutePage,
});

const requestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/requests",
  component: RequestsPage,
});

const manageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manage",
  component: ManagePage,
});

const routeTree = rootRoute.addChildren([
  mapRoute,
  routePlannerRoute,
  requestsRoute,
  manageRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

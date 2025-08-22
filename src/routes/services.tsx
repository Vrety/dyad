import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import ServicesPage from "../pages/services";

export const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});
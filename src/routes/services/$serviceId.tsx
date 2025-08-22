import { createRoute } from "@tanstack/react-router";
import { servicesRoute } from "../services";
import ServiceDetailPage from "../../pages/service-detail";

export const serviceDetailRoute = createRoute({
  getParentRoute: () => servicesRoute,
  path: "/$serviceId",
  component: ServiceDetailPage,
});
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/Home";
import { AllDestinations } from "../pages/AllDestinations";
import { Destination } from "../pages/Destination";
import { AddDestination } from "../components/AddDestination";
import { UpdateDestination } from "../components/UpdateDestination";
import { AllLocations } from "../pages/AllLocations";
import { AddLocation } from "../components/AddLocation";
import { LocationDetails } from "../pages/Location";
import { UpdateLocation } from "../components/UpdateLocation";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/destinations",
    Component: AllDestinations,
  },
  {
    path: "/destinations/:id",
    Component: Destination,
  },
  {
    path: "/destinations/update/:id",
    Component: UpdateDestination,
  },
  {
    path: "/destinations/add",
    Component: AddDestination,
  },
  {
    path: "/locations",
    Component: AllLocations,
  },
  {
    path: "/locations/add",
    Component: AddLocation,
  },
  {
    path: "/locations/:id",
    Component: LocationDetails,
  },
  {
    path: "/locations/update/:id",
    Component: UpdateLocation,
  },
]);
export default function RoutesProvider() {
  return <RouterProvider router={routes} />;
}

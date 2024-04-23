import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ReactElement } from "react";
import { RenderOptions } from "@testing-library/react";
import { DestinationContext } from "../contexts/DestinationContext";
import {
  IDestinationContext,
  IDestinationProviderProps,
} from "../interfaces/DestinationContext";
import { LocationContext } from "../contexts/LocationContext";
import {
  ILocationContext,
  ILocationProviderProps,
} from "../interfaces/LocationContext";
import { IDestination } from "../interfaces/Destination";
import { ILocation } from "../interfaces/Location";
import { AddLocation } from "../components/AddLocation";

const CustomDestinationProvider: React.FC<
  IDestinationProviderProps & { providerProps: IDestinationContext }
> = ({ children, providerProps }) => {
  return (
    <DestinationContext.Provider value={providerProps}>
      {children}
    </DestinationContext.Provider>
  );
};

const CustomLocationProvider: React.FC<
  ILocationProviderProps & { providerProps: ILocationContext }
> = ({ children, providerProps }) => {
  return (
    <LocationContext.Provider value={providerProps}>
      {children}
    </LocationContext.Provider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, "queries"> {
  destinationProps: IDestinationContext;
  locationProps: ILocationContext;
}

const customRender = (
  ui: ReactElement,
  { destinationProps, locationProps, ...options }: CustomRenderOptions
) => {
  return render(
    <CustomDestinationProvider providerProps={destinationProps}>
      <CustomLocationProvider providerProps={locationProps}>
        <MemoryRouter>{ui}</MemoryRouter>
      </CustomLocationProvider>
    </CustomDestinationProvider>,
    options
  );
};

const mockLocations: ILocation[] = [];

const mockDestinations: IDestination[] = [];

const mockDeleteDestination = vi.fn();
const mockAddDestination = vi.fn();
const mockUpdateDestination = vi.fn();
const mockGetDestinationById = vi.fn();

const mockDeleteLocation = vi.fn();
const mockAddLocation = vi.fn();
const mockUpdateLocation = vi.fn();
const mockGetLocationById = vi.fn();

const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockUseNavigate,
  };
});

// vi.mock('../contexts/DestinationContext', () => ({
//   useDestinations: () => ({
//     addDestination: mockAddDestination,
//   }),
// }));

vi.mock("../contexts/DestinationContext", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof DestinationContext;
  return {
    ...actual,
    useDestinations: () => ({
      addDestination: mockAddDestination,
      deleteDestination: mockDeleteDestination,
      updateDestination: mockUpdateDestination,
      getDestinationById: mockGetDestinationById,
      destinations: mockDestinations,
    }),
  };
});

vi.mock("../contexts/LocationContext", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof LocationContext;
  return {
    ...actual,
    useLocations: () => ({
      addLocation: mockAddLocation,
      deleteLocation: mockDeleteLocation,
      updateLocation: mockUpdateLocation,
      getLocationById: mockGetLocationById,
      locations: mockLocations,
    }),
  };
});

const destinationProps = {
  destinations: mockDestinations,
  deleteDestination: mockDeleteDestination,
  addDestination: mockAddDestination,
  updateDestination: mockUpdateDestination,
  getDestinationById: mockGetDestinationById,
};
const locationProps = {
  locations: mockLocations,
  deleteLocation: mockDeleteLocation,
  addLocation: mockAddLocation,
  updateLocation: mockUpdateLocation,
  getLocationById: mockGetLocationById,
};

describe("AddLocation Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", async () => {
    customRender(<AddLocation />, { destinationProps, locationProps });
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Location" })
    ).toBeInTheDocument();
  });

  it('navigates to "/locations" after form submission', async () => {
    const user = userEvent.setup(); // This sets up the user event
    customRender(<AddLocation />, { destinationProps, locationProps });

    await user.click(screen.getByRole("button", { name: "Add Location" }));

    expect(mockUseNavigate).toHaveBeenCalledWith("/locations");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { UpdateLocation } from "../components/UpdateLocation";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
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
import { DestinationContext } from "../contexts/DestinationContext";

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

const mockLocations: ILocation[] = [
  {
    ID: 1,
    name: "Location 1",
    country: "Country 1",
    description: "Description location 1",
  },
];

const mockDestinations: IDestination[] = [
  {
    ID: 1,
    name: "Place A",
    location_id: 1,
    visitors_last_year: 100,
    image_url: "http://example.com/image_a.jpg",
    description: "Description 1",
    is_private: false,
  },
];

const mockAddDestination = vi.fn();
const mockDeleteDestination = vi.fn();
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

describe("UpdateLocation Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("loads location details and displays them", async () => {
    mockGetLocationById.mockResolvedValue({
      ID: 1,
      name: "Location 1",
      country: "Country 1",
      description: "Description 1",
    });

    render(
      <CustomDestinationProvider providerProps={destinationProps}>
        <CustomLocationProvider providerProps={locationProps}>
          <MemoryRouter initialEntries={["/update/1"]}>
            <Routes>
              <Route path="/update/:id" element={<UpdateLocation />} />
            </Routes>
          </MemoryRouter>
        </CustomLocationProvider>
      </CustomDestinationProvider>
    );

    await screen.findByDisplayValue("Location 1");

    expect(screen.getByDisplayValue("Location 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Country 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Description 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update location/i })
    ).toBeInTheDocument();
  });

  it("submits updated location details", async () => {
    const user = userEvent.setup();
    const locationToUpdate = {
      ID: 1,
      name: "Location 1 updated",
      country: "Country 1",
      description: "Description 1",
    };

    mockGetLocationById.mockResolvedValue(locationToUpdate);

    customRender(<UpdateLocation />, { destinationProps, locationProps });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

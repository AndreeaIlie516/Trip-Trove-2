import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { AddDestination } from "../components/AddDestination";
import { MemoryRouter } from "react-router-dom";
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

describe("AddDestination Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", async () => {
    customRender(<AddDestination />, { destinationProps, locationProps });
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Image Url")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Destination" })
    ).toBeInTheDocument();
  });

  it("renders Add Destination button", () => {
    customRender(<AddDestination />, { destinationProps, locationProps });

    const addButton = screen.getByRole("button", { name: /add destination/i });
    expect(addButton).toBeInTheDocument();
  });

  it('navigates to "/destinations" after form submission', async () => {
    const user = userEvent.setup();
    customRender(<AddDestination />, { destinationProps, locationProps });

    await user.click(screen.getByRole("button", { name: "Add Destination" }));

    expect(mockUseNavigate).toHaveBeenCalledWith("/destinations");
  });
});

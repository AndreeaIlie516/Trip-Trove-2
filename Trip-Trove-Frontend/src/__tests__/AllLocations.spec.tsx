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
import { AllLocations } from "../pages/AllLocations";

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
  {
    ID: 2,
    name: "Location 2",
    country: "Country 2",
    description: "Description location 2",
  },
  {
    ID: 3,
    name: "Location 3",
    country: "Country 3",
    description: "Description location 3",
  },
  {
    ID: 4,
    name: "Location 4",
    country: "Country 4",
    description: "Description location 4",
  },
  {
    ID: 5,
    name: "Location 5",
    country: "Country 5",
    description: "Description location 5",
  },
  {
    ID: 6,
    name: "Location 6",
    country: "Country 6",
    description: "Description location 6",
  },
  {
    ID: 7,
    name: "Location 7",
    country: "Country 7",
    description: "Description location 7",
  },
  {
    ID: 8,
    name: "Location 8",
    country: "Country 8",
    description: "Description location 8",
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
  {
    ID: 2,
    name: "Place B",
    location_id: 2,
    visitors_last_year: 200,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 2",
    is_private: false,
  },
  {
    ID: 3,
    name: "Place B",
    location_id: 3,
    visitors_last_year: 300,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 3",
    is_private: false,
  },
  {
    ID: 4,
    name: "Place C",
    location_id: 4,
    visitors_last_year: 400,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 4",
    is_private: false,
  },
  {
    ID: 5,
    name: "Place D",
    location_id: 5,
    visitors_last_year: 500,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 5",
    is_private: false,
  },
  {
    ID: 6,
    name: "Place E",
    location_id: 6,
    visitors_last_year: 200,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 6",
    is_private: false,
  },
  {
    ID: 7,
    name: "Place F",
    location_id: 7,
    visitors_last_year: 400,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 7",
    is_private: false,
  },
  {
    ID: 8,
    name: "Place G",
    location_id: 8,
    visitors_last_year: 500,
    image_url: "http://example.com/image_b.jpg",
    description: "Description 8",
    is_private: false,
  },
];

const mockDeleteDestination = vi.fn();
const mockAddDestination = vi.fn();
const mockUpdateDestination = vi.fn();
const mockGetDestinationById = vi.fn();

const mockDeleteLocation = vi.fn();
const mockAddLocation = vi.fn();
const mockUpdateLocation = vi.fn();
const mockGetLocationById = vi.fn();
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

describe("AllLocations Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders LocationGrid component", async () => {
    customRender(<AllLocations />, { destinationProps, locationProps });
    expect(screen.getByText("Add New Location")).toBeInTheDocument();
  });

  it("renders LocationGrid headers", () => {
    customRender(<AllLocations />, { destinationProps, locationProps });
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders LocationGrid component with all locations", () => {
    customRender(<AllLocations />, { destinationProps, locationProps });
    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Country 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();
    expect(screen.getByText("Country 2")).toBeInTheDocument();
  });

  it("opens dialog and confirms location deletion", async () => {
    const user = userEvent.setup();
    customRender(<AllLocations />, { destinationProps, locationProps });
    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /delete/i });
    await user.click(confirmButton);

    expect(mockDeleteLocation).toHaveBeenCalledWith(mockLocations[0].ID);
  });
});

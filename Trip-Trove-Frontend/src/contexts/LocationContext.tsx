import { createContext, useContext, useEffect, useState } from "react";
import {
  ILocationContext,
  ILocationProviderProps,
} from "../interfaces/LocationContext";
import { ILocation } from "../interfaces/Location";
import baseUrl from "../consts";

export const LocationContext = createContext<ILocationContext | undefined>(
  undefined
);
const locationUrl = `${baseUrl}/locations`;

export function useLocations() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("no context location");
  }
  return context;
}

export const LocationProvider: React.FC<ILocationProviderProps> = ({
  children,
}) => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const fetchLocations = async () => {
    try {
      const response = await fetch(locationUrl);
      if (!response.ok) {
        throw new Error("Could not fetch locations");
      }
      const data = (await response.json()) as ILocation[];
      setLocations(data);
      localStorage.setItem("locations", JSON.stringify(data));
    } catch (error: unknown) {
      console.error(`Error`);
      loadLocationsFromLocalStorage();
    }
  };

  const loadLocationsFromLocalStorage = () => {
    const localData = localStorage.getItem("locations");
    if (localData) {
      setLocations(JSON.parse(localData));
    }
  };

  useEffect(() => {
    const handleNetworkChange = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);
      if (onlineStatus) {
        fetchLocations();
      } else {
        loadLocationsFromLocalStorage();
      }
    };

    if (navigator.onLine) {
      fetchLocations();
    } else {
      loadLocationsFromLocalStorage();
    }

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const getLocationById = async (
    id: number
  ): Promise<ILocation | undefined> => {
    if (navigator.onLine) {
      try {
        const response = await fetch(`${locationUrl}/${id}`);
        if (!response.ok) {
          throw new Error("Could not find location by id");
        }
        const data = (await response.json()) as ILocation;
        return data;
      } catch (error) {
        console.error("Error fetching location from server:", error);
      }
    }

    const localData = localStorage.getItem("locations");
    if (localData) {
      const locations = JSON.parse(localData);
      const location = locations.find((loc: ILocation) => loc.ID === id);
      return location;
    }

    console.warn("Location not found in local storage");
    return undefined;
  };

  const addLocation = async (location: ILocation) => {
    try {
      const response = await fetch(locationUrl, {
        method: "POST",
        body: JSON.stringify(location),
      });
      if (!response.ok) {
        throw new Error("could not add location");
      }
      await fetchLocations();
    } catch (error: unknown) {
      console.log("error");
    }
  };

  const deleteLocation = async (id: number) => {
    console.log(`delete called for location ${id}`);
    try {
      const response = await fetch(`${locationUrl}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("cannot delete location");
      }
      await fetchLocations();
    } catch (err: unknown) {
      console.log(`error`);
    }
  };

  const updateLocation = async (location: ILocation) => {
    try {
      const response = await fetch(`${locationUrl}/${location.ID}`, {
        method: "PUT",
        body: JSON.stringify(location),
      });
      if (!response.ok) {
        throw new Error("could not update destination");
      }
      await fetchLocations();
    } catch (err: unknown) {
      console.log("error");
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        getLocationById,
        addLocation,
        deleteLocation,
        updateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

import { ReactNode } from "react";
import { ILocation } from "./Location";

export interface ILocationContext {
  locations: ILocation[];
  getLocationById: (id: number) => Promise<ILocation | undefined>;
  addLocation: (destination: ILocation) => void;
  deleteLocation: (id: number) => void;
  updateLocation: (destination: ILocation) => void;
}

export interface ILocationProviderProps {
  children: ReactNode;
}
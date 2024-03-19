import { ReactNode } from "react";
import { IDestination } from "./Destination";

export interface IDestinationContext {
  destinations: IDestination[];
  getDestinationById: (id: number) => Promise<IDestination | undefined>;
  addDestination: (destination: IDestination) => void;
  deleteDestination: (id: number) => void;
  updateDestination: (destination: IDestination) => void;
}

export interface IDestinationProviderProps {
  children: ReactNode;
}

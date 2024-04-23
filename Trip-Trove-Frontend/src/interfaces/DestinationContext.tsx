import { ReactNode } from "react";
import { IDestination } from "./Destination";

export interface IDestinationContext {
  destinations: IDestination[];
  getDestinationById: (id: number) => Promise<IDestination | undefined>;
  addDestination: (destination: IDestination, forceSync: boolean) => void;
  deleteDestination: (id: number, forceSync: boolean) => void;
  updateDestination: (destination: IDestination, forceSync: boolean) => void;
}

export interface IDestinationProviderProps {
  children: ReactNode;
}

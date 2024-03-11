import { createContext, useContext, useEffect, useState } from "react";
import {
  IDestinationContext,
  IDestinationProviderProps,
} from "../interfaces/DestinationContext";
import { IDestination } from "../interfaces/Destination";
import baseUrl from "../consts";

const DestinationContext = createContext<IDestinationContext | undefined>(
  undefined
);
const destinationUrl = `${baseUrl}/destinations`;

export function useDestinations() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("no context");
  }
  return context;
}

export const DestinationProvider: React.FC<IDestinationProviderProps> = ({
  children,
}) => {
  const [destinations, setDestinations] = useState<IDestination[]>([]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(destinationUrl);
      if (!response.ok) {
        throw new Error("Could not fetch destinations");
      }
      const data = (await response.json()) as IDestination[];
      console.log("data", data);
      setDestinations(data);
    } catch (error: unknown) {
      console.error(`Error`);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const getDestinationById = async (id: number): Promise<IDestination | undefined> => {
    try {
        const response = await fetch(`${destinationUrl}/${id}`);
        if (!response.ok) {
          throw new Error('could not find destination by id');
        }
        const data = await response.json() as IDestination;
        return data;
      } catch (err: unknown) {
        console.log(`error`);
      }
  }

  const deleteDestination = async (id: number) => {
    console.log(`delete called for destination ${id}`)
    try {
      const response = await fetch(`${destinationUrl}/${id}`, {
        method: 'DELETE',
      });
      if(!response.ok) {
        throw new Error('cannot delete destination');
      }
      await fetchDestinations();
    } catch (err: unknown) {
      console.log(`error`);
    }
  }

  return (
    <DestinationContext.Provider value={{ destinations, getDestinationById, deleteDestination }}>
      {children}
    </DestinationContext.Provider>
  );
};

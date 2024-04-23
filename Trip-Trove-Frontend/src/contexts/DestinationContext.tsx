import { createContext, useContext, useEffect, useState } from "react";
import {
  IDestinationContext,
  IDestinationProviderProps,
} from "../interfaces/DestinationContext";
import { IDestination } from "../interfaces/Destination";
import baseUrl from "../consts";

export const DestinationContext = createContext<
  IDestinationContext | undefined
>(undefined);
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

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    fetchDestinations();

    const ws = new WebSocket("ws://localhost:3000/ws");
    setWebSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message: " + message);
      console.log("Message action: " + message.action);
      if (message.action === "GenerateDestination") {
        const newDestination = message.destination;
        setDestinations((prevDestinations) => {
          const updatedDestinations = [...prevDestinations, newDestination];
          console.log("Updated Destinations:", updatedDestinations);
          return updatedDestinations;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNetworkChange = () => {
    const onlineStatus = navigator.onLine;
    setIsOnline(onlineStatus);
    if (onlineStatus) {
      syncWithServer();
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch(destinationUrl);
      if (!response.ok) {
        throw new Error("Could not fetch destinations");
      }
      const data = (await response.json()) as IDestination[];
      setDestinations(data);
    } catch (error: unknown) {
      console.error(`Error`);
    }
  };

  const syncWithServer = async (): Promise<void> => {
    const changes: Array<{
      type: string;
      destination?: IDestination;
      id?: number;
    }> = JSON.parse(localStorage.getItem("destinationChanges") || "[]");
    if (changes.length === 0) {
      return;
    }

    const syncPromises = changes.map((change) => {
      try {
        switch (change.type) {
          case "add":
            if (change.destination) {
              return fetch(destinationUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(change.destination),
              }).then((response) =>
                response.json().then((data) => ({
                  ...change,
                  synced: true,
                  response: data,
                }))
              );
            }
            break;
          case "update":
            if (change.destination) {
              return fetch(`${destinationUrl}/${change.destination.ID}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(change.destination),
              }).then((response) =>
                response.json().then((data) => ({
                  ...change,
                  synced: true,
                  response: data,
                }))
              );
            }
            break;

          case "delete":
            if (change.id !== undefined) {
              return fetch(`${destinationUrl}/${change.id}`, {
                method: "DELETE",
              }).then((response) =>
                response.json().then((data) => ({
                  ...change,
                  synced: true,
                  response: data,
                }))
              );
            }
            break;

          default:
            throw new Error("Unrecognized change type");
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    });

    Promise.all(syncPromises).then((results) => {
      results.forEach((result) => {
        if (result!.synced) {
          console.log(`Synchronized successfully:`, result!.response);
        } else {
          console.error(`Failed to sync:`, result);
        }
      });

      localStorage.removeItem("destinationChanges");
      fetchDestinations();
    });
  };

  useEffect(() => {
    checkNetworkAndFetchDestinations();
    handleNetworkChange();

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const modifyLocalChanges = (type: string, data: any): void => {
    let changes = JSON.parse(
      localStorage.getItem("destinationChanges") || "[]"
    );
    if (type === "update") {
      changes = changes.filter(
        (change: any) =>
          !(
            change.type === "update" &&
            change.destination.ID === data.destination.ID
          )
      );
    }
    changes.push({ type, ...data });
    localStorage.setItem("destinationChanges", JSON.stringify(changes));
  };

  const checkNetworkAndFetchDestinations = () => {
    if (navigator.onLine) {
      fetchDestinationsFromServer();
    } else {
      loadDestinationsFromLocalStorage();
    }
  };

  const fetchDestinationsFromServer = async () => {
    try {
      const response = await fetch(destinationUrl);
      if (response.ok) {
        const data = (await response.json()) as IDestination[];
        setDestinations(data);
        localStorage.setItem("destinations", JSON.stringify(data));
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
      loadDestinationsFromLocalStorage();
    }
  };

  const loadDestinationsFromLocalStorage = () => {
    const localData = localStorage.getItem("destinations");
    if (localData) {
      setDestinations(JSON.parse(localData));
    } else {
      console.warn("No local data available");
      setDestinations([]);
    }
  };

  const getDestinationById = async (
    id: number
  ): Promise<IDestination | undefined> => {
    console.log("id: " + id);
    if (navigator.onLine) {
      try {
        const response = await fetch(`${destinationUrl}/${id}`);
        if (!response.ok) {
          throw new Error("Server responded with an error");
        }
        const fetchedDestination = await response.json();
        return fetchedDestination;
      } catch (error) {
        console.error(`Error fetching destination from server: ${error}`);
      
      }
    }

     const localData = localStorage.getItem("destinations");
    if (localData) {
      const destinations = JSON.parse(localData);
      const destination = destinations.find((d: IDestination) => d.ID === id);
      if (destination) {
        console.log("Found destination in local storage:", destination);
        return destination;
      }
    }

    console.warn("Destination not found in local storage");
    return undefined;
  };

  const addDestination = async (
    destination: IDestination,
    forceSync: boolean = false
  ) => {
    if (isOnline && !forceSync) {
      try {
        console.log("add json: " + JSON.stringify(destination));
        const response = await fetch(destinationUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(destination),
        });

        if (response.ok) {
          const addedDestination = await response.json();
          setDestinations((prev) => [...prev, addedDestination]);
          updateLocalStorage([...destinations, addedDestination]);
        } else {
          throw new Error("Failed to add destination to server");
        }
      } catch (error: unknown) {
        modifyLocalChanges("add", { destination });
        setDestinations((prev) => [...prev, destination]);
      }
    } else {
      modifyLocalChanges("add", { destination });
      setDestinations((prev) => [...prev, destination]);
      updateLocalStorage([...destinations, destination]);
    }
  };

  const deleteDestination = async (id: number, forceSync: boolean = false) => {
    const isDeletedOffline = !isOnline || forceSync;

    if (isDeletedOffline) {
      modifyLocalChanges("delete", { id });

      updateStateAndStorage(id);
    } else {
      try {
        const response = await fetch(`${destinationUrl}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete destination");
        updateStateAndStorage(id);
      } catch (error) {
        console.error("Delete error:", error);
        modifyLocalChanges("delete", { id });
        updateStateAndStorage(id);
      }
    }
  };

  const updateStateAndStorage = (id: number) => {
    setDestinations((prev) => {
      const updatedDestinations = prev.filter(
        (destination) => destination.ID !== id
      );
      updateLocalStorage(updatedDestinations);
      return updatedDestinations;
    });
  };

  const updateLocalStorage = (destinations: IDestination[]) => {
    localStorage.setItem("destinations", JSON.stringify(destinations));
  };

  const updateDestination = async (
    destination: IDestination,
    forceSync: boolean = false
  ) => {
    const updateLocal = () => {
      setDestinations((prevDestinations) => {
        const updatedDestinations = prevDestinations.map((d) =>
          d.ID === destination.ID ? { ...d, ...destination } : d
        );
        updateLocalStorage(updatedDestinations);
        return updatedDestinations;
      });
      modifyLocalChanges("update", { destination });
    };

    if (navigator.onLine && !forceSync) {
      try {
        const response = await fetch(`${destinationUrl}/${destination.ID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(destination),
        });
        if (response.ok) {
          updateLocal();
        } else {
          throw new Error("Failed to update destination");
        }
      } catch (error) {
        console.error("Update error:", error);
        updateLocal();
      }
    } else {
      updateLocal();
    }
  };

  return (
    <DestinationContext.Provider
      value={{
        destinations,
        getDestinationById,
        addDestination,
        deleteDestination,
        updateDestination,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

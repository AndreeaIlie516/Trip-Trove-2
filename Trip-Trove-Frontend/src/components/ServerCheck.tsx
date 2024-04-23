import React, { useEffect, useState } from "react";
import baseUrl from "../consts";

interface WarningState {
  show: boolean;
  message: string;
}

const ServerCheck: React.FC = () => {
  const [warning, setWarning] = useState<WarningState>({
    show: false,
    message: "",
  });

  const checkServer = async () => {
    try {
      const response = await fetch(`${baseUrl}/destinations`, {
        method: "HEAD",
        cache: "no-cache",
      });

      if (!response.ok) throw new Error("Server response not OK");

      if (warning.show) setWarning({ show: false, message: "" });
    } catch (error) {
      console.error("Fetch error:", error);
      setWarning({
        show: true,
        message: "Our server seems to be down. Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (!navigator.onLine) {
      setWarning({
        show: true,
        message: "Your internet connection appears to be offline.",
      });
    } else {
      checkServer();
    }

    window.addEventListener("online", checkServer);
    window.addEventListener("offline", () =>
      setWarning({
        show: true,
        message: "Your internet connection appears to be offline.",
      })
    );

    const interval = setInterval(checkServer, 60000); 

    return () => {
      window.removeEventListener("online", checkServer);
      window.removeEventListener("offline", () =>
        setWarning({
          show: true,
          message: "Your internet connection appears to be offline.",
        })
      );
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {warning.show && (
        <div
          style={{ backgroundColor: "red", color: "white", padding: "10px" }}
        >
          {warning.message}
        </div>
      )}
    </div>
  );
};

export default ServerCheck;

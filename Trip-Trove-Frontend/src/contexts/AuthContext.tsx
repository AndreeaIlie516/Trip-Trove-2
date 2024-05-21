import React, { createContext, useState, useContext, useEffect } from "react";
import {
  IUser,
  IRegisterRequest,
  ILoginRequest,
  ILoginResponse,
} from "../interfaces/User";
import { IAuthContext, IAuthProviderProps } from "../interfaces/AuthContext";
import baseUrl from "../consts";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const userUrl = `${baseUrl}/users`;

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const register = async (data: IRegisterRequest) => {
    const response = await fetch(userUrl + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    const userData = await response.json();
    setUser(userData);
    setIsLoggedIn(true);
  };

  const login = async (data: ILoginRequest) => {
    const response = await fetch(userUrl + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        throw new Error("Invalid email or password");
      }
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error(errorText);
    }
    const loginData: ILoginResponse = await response.json();
    console.log(loginData);
    localStorage.setItem("token", loginData.jwt);

    const userResponse = await fetch(`${userUrl}/${loginData.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.jwt}`,
      },
    });
    if (!userResponse.ok) {
      throw new Error("Failed to fetch user details");
    }
    const userData: IUser = await userResponse.json();
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const getUserById = async (id: string): Promise<IUser | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await fetch(`${userUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return null; // Ensure that null is returned if the request fails
    }
    const userData: IUser = await response.json();
    return userData || null; // Ensure that null is returned if userData is undefined
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, getUserById, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

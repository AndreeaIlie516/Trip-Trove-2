import { ReactNode } from "react";
import { IUser, IRegisterRequest, ILoginRequest, ILoginResponse } from "./User";

export interface IAuthContext {
    user: IUser | null;
    register: (data: IRegisterRequest) => Promise<void>;
    login: (data: ILoginRequest) => Promise<void>;
    logout: () => void;
    getUserById: (id: string) => Promise<IUser | null>;
    isLoggedIn: boolean;
  }
  

export interface IAuthProviderProps {
    children: ReactNode;
  }
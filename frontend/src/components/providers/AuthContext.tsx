// AuthContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import io, { Socket } from "socket.io-client";

interface AuthContextType {
  isAuthenticated: boolean;
  dataUser: UserProfile;
  socketchat: Socket;
  login: () => void;
  logout: () => void;
  setuserdata: (data: UserProfile) => void;
  setuserdatanull: () => void;
}
export interface UserProfile {
  user: any;
  auth_id: string;
  nickname: string;
  displayname: string;
  picture: string;
  bio: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dataUser, setDataUser] = useState<UserProfile | null>(null);
  const [socketchat, setSocketchat] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socketchat) {
      const newSocket = io("http://localhost:8000", {
        withCredentials: true,
      });
      setSocketchat(newSocket);
      console.log(newSocket);
    }
  }, [socketchat]);
  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  const setuserdata = (data: UserProfile | null) => {
    setDataUser(data);
  };
  const setuserdatanull = () => {
    setDataUser(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    dataUser,
    socketchat,
    login,
    logout,
    setuserdata,
    setuserdatanull,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  points: number;
  image?: string;
  profile?: string;
}
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  loading: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

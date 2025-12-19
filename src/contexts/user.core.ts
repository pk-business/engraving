import { createContext } from 'react';

export interface User {
  id: string | number;
  username: string;
  email: string;
  jwt?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

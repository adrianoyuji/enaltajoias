import React, { createContext, useState, useContext } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

interface UserContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login({ email, password }: LoginCredentials): Promise<void>;
  signout(): Promise<void>;
}

enum Role {
  ADMIN = "ADMIN",
  REVENDEDOR = "REVENDEDOR",
}
interface Jewel {
  id: string;
  name: string;
  price: number;
}

interface Briefcase {
  owner_id: string;
  owner_name: string;
  jewels: Jewel[] | [];
}

interface User {
  email: string;
  full_name: string;
  role: Role;
  password: string;
  city: string;
  phone_number: string;
  briefcases: Briefcase[] | [];
}

interface LoginCredentials {
  email: string;
  password: string;
}
const AuthContext = createContext<UserContextData>({} as UserContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  const login = async ({ email, password }: LoginCredentials) => {
    console.log(email, password);
  };
  const signout = async () => {};

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, loading, login, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export default { useAuth, AuthProvider };

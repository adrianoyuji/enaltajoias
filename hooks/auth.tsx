import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import api from "utils/api";

interface UserContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login({ email, password }: LoginCredentials): Promise<void>;
  signout(): Promise<void>;
  loadingStorage: boolean;
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
  const [loadingStorage, setLoadingStorage] = useState<boolean>(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    getUserSession();
  }, []);

  const getUserSession = () => {
    const localUser = localStorage.getItem("@EnaltaJoias:user");
    if (localUser) {
      setUser(JSON.parse(localUser));
      router.replace("/painel");
    }
    setLoadingStorage(false);
  };

  const login = async ({ email, password }: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/auth`, { email, password });
      setUser(response.data.user);
      localStorage.setItem(
        "@EnaltaJoias:user",
        JSON.stringify(response.data.user)
      );
      toast({
        title: "Entrou com sucesso",
        description: "Bem vindo ao Software Bistrô.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.replace("/painel");
    } catch (error) {}
    setLoading(false);
  };
  const signout = async () => {
    localStorage.removeItem("@EnaltaJoias:user");
    setUser(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, loading, login, signout, loadingStorage }}
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

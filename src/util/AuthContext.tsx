import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useState, useEffect } from "react";
import Router from "next/router";
import { api } from "./apiClient";
import Util from "./Util";
import { Msg } from "./Msg";

type AuthContextData = {
  user: UserType;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

export type UserType = {
  id: number;
  name: string;
  login: string;
  type: string;
};
type SignInProps = {
  login: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    const result = destroyCookie({}, Util.cookie, { path: "/" });
    Router.push("/"); //tela de login
  } catch (e) {
    throw new Error(e);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType>();
  const isAuthenticated = !!user; //transforma o objeto em booleano

  useEffect(() => {
    const { "@nextauth.token": token } = parseCookies();
    if (token) {
      api
        .get(`/me`)
        .then((response) => {
          const { id, name, login, type } = response.data;
          setUser({ id, name, login, type });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ login, password }: SignInProps) {
    try {
      const response = await api.post("/login", { login, password });

      const { id, name, type, token } = response.data;

      setCookie(undefined, Util.cookie, token, {
        maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes
        path: "/", //todos os caminhos terao acesso ao cookir
      });

      setUser({ id, name, login, type });

      //passar pra proximas requisicoes o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/construction/list");
    } catch (e) {
      throw new Error(Msg.ERROR_LOGIN_FAIL);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

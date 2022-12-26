import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "./AuthContext";
import Util from "./Util";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: Util.SERVER_BASE_URL,
    headers: {
      Authorization: `Bearer ${cookies[Util.cookie]}`,
    },
  });

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    (e: AxiosError) => {
      if (e.response.status === 401) {
        //qq erro 401 devemos deslogar o user
        if (typeof window !== undefined) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
        return Promise.reject(e);
      }
    }
  );
  return api;
}

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";
import Util from "./Util";

//funcao de pages q só podem ser acessados por visitantes
export function canRSSGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookie = parseCookies(ctx);
    //verifica se esta logado e redireciona
    if (cookie[Util.cookie]) {
      return {
        redirect: {
          destination: "/construction/list",
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}

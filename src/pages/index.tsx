import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";

import { AuthContext } from "../util/AuthContext";
import { canRSSGuest } from "../util/canSSRGuest";
import Head from "next/head";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import styles from "../styles/styles.module.css";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [login, setLogin] = useState(""); //comeca como vazio
  const [password, setPassword] = useState(""); //comeca como vazio
  const [loading, setLoading] = useState(false); //comeca como vazio

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (login == "" || password == "") {
      toast.error("Preencha todos os campos!");
    } else {
      setLoading(true);
      let credentials = {
        login: login,
        password: password,
      };
      try {
        await signIn(credentials);
      } catch (e) {
        toast.error(e.message);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>VA Engenharia - Faça seu Login</title>
      </Head>
      <div className={styles.containerLogin}>
        <div className={styles.loginArea}>
          <div className={styles.loginHeader}>Login</div>
          <form onSubmit={handleLogin}>
            <div className={styles.loginBody}>
              <div className={styles.formLine}>
                <label htmlFor="login" className="label">
                  Username:
                </label>
                <Input
                  type="text"
                  id="login"
                  name="login"
                  value={login}
                  placeholder="Digite seu login"
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className={styles.formLine}>
                <label htmlFor="password" className="label">
                  Senha:
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Digite sua senha"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.loginFooter}>
                <Button type="submit" loading={loading}>
                  Entrar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canRSSGuest(async (ctx) => {
  return {
    props: {},
  };
});

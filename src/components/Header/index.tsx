import { useContext } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";

import { AuthContext } from "../../util/AuthContext";

export function Header() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLogo}>
        <Link href="/">
          <img src="/logo.jpg" className={styles.logoImg} />
        </Link>
      </div>
      <div className={styles.headerConfig}>
        <div className={styles.headerUser}>{user?.name}</div>
        <button className={styles.headerBtLogout} onClick={signOut}>
          <FiLogOut color="#07365b" size={16} />
        </button>
      </div>
    </header>
  );
}

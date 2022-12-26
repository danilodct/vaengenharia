import styles from "./styles.module.css";
import Link from "next/link";
import { MdOutlineHouse } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../util/AuthContext";
import Util from "../../util/Util";

interface MenuProps {
  atual: string;
}

export function Menu({ atual }: MenuProps) {
  const { user } = useContext(AuthContext);
  return (
    <div className={styles.colLeft}>
      <div className={styles.menuContainer}>
        <Link href="/construction/list">
          {atual == "construction" ? (
            <a className={styles.linkMenuAtivo} id="menuConstruction">
              <MdOutlineHouse size={22} className={styles.menuIcon} />
              Obras
            </a>
          ) : (
            <a className={styles.linkMenu} id="menuConstruction">
              <MdOutlineHouse size={22} className={styles.menuIcon} />
              Obras
            </a>
          )}
        </Link>
        <Link href="/orderrequest/list">
          {atual == "orderRequest" ? (
            <a className={styles.linkMenuAtivo}>
              <FaTasks size={22} className={styles.menuIcon} />
              Requisições
            </a>
          ) : (
            <a className={styles.linkMenu}>
              <FaTasks size={22} className={styles.menuIcon} />
              Requisições
            </a>
          )}
        </Link>
        <Link href="/finance/">
          {atual == "finance" ? (
            <a className={styles.linkMenuAtivo}>
              <TbReportMoney size={22} className={styles.menuIcon} />
              Financeiro
            </a>
          ) : (
            <a className={styles.linkMenu}>
              <TbReportMoney size={22} className={styles.menuIcon} />
              Financeiro
            </a>
          )}
        </Link>
      </div>
    </div>
  );
}

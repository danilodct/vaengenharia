import { InputHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function InputSearch({ ...rest }: InputProps) {
  return (
    <div className={styles.containerInputSearch}>
      <input className={styles.inputSearch} {...rest} />
    </div>
  );
}

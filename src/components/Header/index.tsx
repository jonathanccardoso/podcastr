import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";

import styles from "./styles.module.scss";

type HeaderProps = {
  themeToggler: () => void;
};

export function Header({ themeToggler }: HeaderProps) {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
      <button onClick={themeToggler}>Switch Theme</button>
    </header>
  );
}

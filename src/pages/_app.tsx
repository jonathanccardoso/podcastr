import { useState } from "react";
import { ThemeProvider } from "styled-components";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContextProvider } from "../contexts/PlayerContext";

import GlobalStyle from "../styles/global.js";

import { lightTheme, darkTheme } from "../components/Themes";
import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState("light");
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header themeToggler={themeToggler} />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default MyApp;

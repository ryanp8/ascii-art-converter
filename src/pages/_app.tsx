import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";

import { UserContext } from "@/context/userContext";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = React.useState<any>(null);

  return (
    <Provider store={store}>
      <UserContext.Provider value={{user, setUser}}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </Provider>
  );
}

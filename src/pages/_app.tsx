import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";

import { UserContext } from "@/context/userContext";
import Navbar from "@/components/Navbar";


export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
    (async () => {
      const res = await fetch('/api/getUser');
      if (res.status == 400) {
        setUser(null);
        return;
      };
      const user = await res.json();
      setUser(user);
    })();
  }, [])

  return (
    <Provider store={store}>
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar />
        <Component {...pageProps} />
      </UserContext.Provider>
    </Provider>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";

import { UserContext } from "@/context/userContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <UserContext.Provider value={null}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </Provider>
  );
}

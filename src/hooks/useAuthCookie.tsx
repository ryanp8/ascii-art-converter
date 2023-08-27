import React from "react";
import { getCookie, getCookies } from "cookies-next";

export default function useAuthCookie() {
  const [cookie, setCookie] = React.useState("");

  React.useEffect(() => {
    console.log(getCookies())
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      setCookie(accessToken);
    }
  });

  return cookie;
}

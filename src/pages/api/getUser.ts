import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  extractAccessTokenCookie,
  parseDecodedToken,
  createAccessToken,
  verify,
} from "@/auth";
import { serialize } from "cookie";

import { prisma } from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers.cookie) {
    res.status(400).send({ message: "not logged in" });
    return;
  }

  const accessToken = extractAccessTokenCookie(req.headers.cookie);
  if (!accessToken) {
    res.status(400).send({ message: "not logged in" });
    return;
  }

  const decodedPayload = jwt.decode(accessToken) as JwtPayload;
  const { userId } = parseDecodedToken(decodedPayload.data);

  try {
    verify(accessToken, "access");
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).send({ message: "user not found" });
      return;
    }
    res.status(200).send({ userId: user.id, username: user.username });
    return;
  } catch (e) {
    console.log(e);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).send({ message: "user not found" });
      return;
    }

    if (!user.refreshToken) {
      res.status(401).send({ message: "no refresh token found" });
      return;
    }

    try {
      verify(user.refreshToken, "refresh");

      const newAccessToken = createAccessToken(userId, user.username);
      res.setHeader(
        "Set-Cookie",
        `${serialize("accessToken", newAccessToken)}; HttpOnly; Path=/`
      );
      res.status(200).send({ userId: user.id, username: user.username });
      return;
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "an error occurred" });
      return;
    }
  }
}

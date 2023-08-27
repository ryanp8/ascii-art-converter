// 'use server'

import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { extractAccessTokenCookie, parseDecodedToken } from "@/auth";

import { prisma } from "../../../prisma";
// import { cookies } from "next/headers";
import { serialize } from "cookie";

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
  const {userId} = parseDecodedToken(decodedPayload.data);
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    res.setHeader(
      "Set-Cookie",
      serialize("accessToken", "", {
        maxAge: -1,
        path: "/",
      })
    );

    res.status(200).send({ message: "Successfully logged out" });
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: e });
  }
}

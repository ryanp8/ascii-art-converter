import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { extractAccessTokenCookie, parseDecodedToken } from "@/auth";

import { prisma } from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, asciiId } = JSON.parse(req.body);

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
  const { userId: tokenUserId } = parseDecodedToken(decodedPayload.data);
  if (userId !== tokenUserId) {
    res.status(401).send({ message: "unauthorized" });
    return;
  }

  try {
    const deleted = await prisma.picture.delete({
      where: { id: asciiId },
    });
    res.status(200).send({ message: "deleted" });
    return;
  } catch (err: any) {
    res.send({ error: err });
    return;
  }
}

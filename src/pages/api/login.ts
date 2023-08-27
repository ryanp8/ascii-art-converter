import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../../prisma";

import { createRefreshToken, createAccessToken } from "@/auth";

interface ReqData {
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password }: ReqData = JSON.parse(req.body);
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  const validPassword = bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).send({ message: "Incorrect password" });
    return;
  }

  const accessToken = createAccessToken(username);
  const refreshToken = createRefreshToken(username);

  await prisma.user.update({
    where: { username },
    data: {
      refreshToken,
    },
  });

  res.status(200).send({ userId: user.id, accessToken });
}

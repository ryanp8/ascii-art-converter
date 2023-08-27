import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import { prisma } from "../../../prisma";
import { createAccessToken, createRefreshToken } from "@/auth";

interface ReqData {
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password }: ReqData = JSON.parse(req.body);
  console.log(username, password)
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    res.status(400).send({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const accessToken = createAccessToken(username);
    const refreshToken = createRefreshToken(username);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        refreshToken,
      },
    });
    res.status(200).send({ userId: user.id, accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unable to create user" });
  }
}

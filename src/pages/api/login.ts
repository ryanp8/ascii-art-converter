// 'use server'

import { NextApiRequest, NextApiResponse } from "next";
// import { cookies } from "next/headers"
import { serialize } from "cookie";
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

  const validPassword = await bcrypt.compare(password, user.password);
  console.log(validPassword)
  if (!validPassword) {
    res.status(401).send({ message: "Incorrect password" });
    return;
  }

  const accessToken = createAccessToken(user.id, user.username);
  const refreshToken = createRefreshToken(user.id, user.username);

  await prisma.user.update({
    where: { username },
    data: {
      refreshToken,
    },
  });
  // cookies().set({
  //   name: 'accessToken',
  //   value: accessToken,
  //   httpOnly: true,
  //   path: '/'
  // });
  res.setHeader(
    "Set-Cookie",
    `${serialize("accessToken", accessToken)}; HttpOnly; Path=/`
  );
  res.status(200).send({ userId: user.id, username: user.username });
}

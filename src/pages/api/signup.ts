// 'use server'

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

import { prisma } from "../../../prisma";
import { createAccessToken, createRefreshToken } from "@/auth";
import { cookies } from "next/headers";

interface ReqData {
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password }: ReqData = JSON.parse(req.body);
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    res.status(401).send({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const accessToken = createAccessToken(user.id, username);
    const refreshToken = createRefreshToken(user.id, username);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    res.setHeader(
      "Set-Cookie",
      `${serialize("accessToken", accessToken)}; HttpOnly; Path=/`
    );
    // cookies().set({
    //   name: 'accessToken',
    //   value: accessToken,
    //   httpOnly: true,
    //   path: '/'
    // });
    res.status(200).send({ userId: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unable to create user" });
  }
}

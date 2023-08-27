
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";

import { createAccessToken, extractAccessTokenCookie, verify, parseDecodedToken } from "@/auth";
import { prisma } from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ascii } = JSON.parse(req.body);

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
    await prisma.picture.create({
      data: {
        dateCreated: new Date(),
        translated: ascii,
        authorId: userId,
      },
    });
    res.status(200).send({message: "succcessfully uploaded"});
  } catch (e) {
    console.log(e);
    res.status(500).send({message: "an error occured"});
    return
  }

  // try {
  //   verify(accessToken, "access");
  //   await prisma.picture.create({
  //     data: {
  //       dateCreated: new Date(),
  //       translated: ascii,
  //       authorId: userId,
  //     },
  //   });
  //   res.status(200).send({ message: "uploaded" });
  //   return;
  // } catch (e) {
  //   console.log(e);

  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //   });
  //   if (!user) {
  //     res.status(404).send({ message: "user not found" });
  //     return;
  //   }

  //   if (!user.refreshToken) {
  //     res.status(401).send({ message: "no refresh token found" });
  //     return;
  //   }

  //   try {
  //     verify(user.refreshToken, "refresh");
  //     await prisma.picture.create({
  //       data: {
  //         dateCreated: new Date(),
  //         translated: ascii,
  //         authorId: userId,
  //       },
  //     });

  //     const newAccessToken = createAccessToken(userId, user.username);
	// 		res.setHeader(
	// 			"Set-Cookie",
	// 			`${serialize("accessToken", newAccessToken)}; HttpOnly; Path=/`
	// 		);
  //     res
  //       .status(200)
  //       .send({ message: "uploaded and created new access token" });
  //     return;
  //   } catch (e) {
  //     console.log(e);
  //     res.status(500).send({ message: "an error occurred" });
  //     return;
  //   }
  // }
}

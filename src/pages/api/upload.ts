import { NextApiRequest, NextApiResponse } from "next";

import { verify } from "@/auth";
import { prisma } from "@/../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, accessToken, ascii } = JSON.parse(req.body);

	async function upload() {
		await prisma.picture.create({
			data: {
				dateCreated: Date.now().toLocaleString(),
				translated: ascii,
				authorId: userId,
			},
		});
	}

  if (verify(accessToken)) {
    try {
      await upload()
      res.status(200).send({ message: "successful upload" });
    } catch {
      res.status(500).send({ message: "unable to upload" });
    }
		return
  }

	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});
	if (user?.refreshToken && verify(user?.refreshToken)) {
		try {
      await upload();
      res.status(200).send({ message: "successful upload" });
    } catch {
      res.status(500).send({ message: "unable to upload" });
    }
		return
	}

	res.status(401).send({message: "user unauthorized"});
	return;
}

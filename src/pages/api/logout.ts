import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/../prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = JSON.parse(req.body);
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    res.status(200).send({message: 'Successfully logged out'});
  } catch (e) {
    res.status(404).send({ message: e });
  }
}

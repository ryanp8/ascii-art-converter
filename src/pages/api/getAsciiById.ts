import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../prisma";

interface Data {
  result?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.body;
  try {
    const ascii = await prisma.picture.findUnique({
      where: {
        id,
      },
    });
    if (ascii) {
      if (ascii.translated) {
        res.status(200).send({ result: ascii.translated });
        return;
      }
      res.status(404).send({ error: "Picture not found" });
    }
  } catch (err: any) {
    res.send({ error: err });
  }
}

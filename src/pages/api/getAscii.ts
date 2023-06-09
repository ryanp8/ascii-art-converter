import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../prisma";

interface Data {
  result?: { id: string; ascii: string }[];
  error?: string;
}

export async function getData(take: number, skip: number) {
  const ascii = await prisma.picture.findMany({
    take,
    skip,
  });

  if (ascii) {
    let data = [];
    for (const a of ascii) {
      data.push({
        id: a.id,
        ascii: a.translated as string,
      });
    }
    return data;
  }
  return [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const paramstr = req.url?.split("?")[1];
  const paramsList = paramstr?.split("&");
  //   console.log(searchParams);]
  const params: { [name: string]: string } = {};
  if (paramsList) {
    for (const param of paramsList) {
      const s = param.split("=");
      const key = s[0];
      params[key] = s[1];
    }
  }

  const take = parseInt(params.take);
  const skip = parseInt(params.skip);

  try {
    const data = await getData(take, skip);
    res.status(200).send({ result: data });
  } catch (err: any) {
    res.send({ error: err });
  }
}

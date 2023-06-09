// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../firebase";
import { getStorage, ref, uploadString } from "firebase/storage";
import Jimp from 'jimp';

import { prisma } from "../../../prisma";

const CHARACTERS = ['-', '.', ',', ':', ';', 'o', 'x', 'W', '#', '@'];

type Data = {
  result?: string;
  error?: string;
};

const getIdxs = async (imgData: string) => {
  const image = await Jimp.read(Buffer.from(imgData, 'base64'));
  const height = image.getHeight();
  const width = image.getWidth();
  const chunkHeight = Math.floor(8);
  const chunkWidth = Math.floor(4);
  const gray = image.grayscale();

  let chunkIdxs = []
  for (let i = 0; i < width; i+=chunkWidth) {
    let next = []
    for (let j = 0; j < height; j+=chunkHeight) {
      next.push(0)
    }
    chunkIdxs.push(next);
  }

  for (let i = 0; i < width; i+=chunkWidth) {
    for (let j = 0; j < height; j+=chunkHeight) {
      let total = 0;
      for (let ii = i; ii < i + chunkWidth; ii++) {
        for (let jj = j; jj < j + chunkHeight; jj++) {
          const c = Jimp.intToRGBA(gray.getPixelColor(i, j)).r;
          total = total + c;
        }
      }
      const avg = total / (chunkHeight * chunkWidth);
      const idx = CHARACTERS.length - (Math.floor((avg / 255) * (CHARACTERS.length - 1))) - 2;
      chunkIdxs[Math.floor(i / chunkWidth)][Math.floor(j / chunkHeight)] = idx;

    }
  }
  return chunkIdxs;
}

const constructString = (idxs: number[][]) => {
  let ret = ''
  const height = idxs.length;
  if (height == 0) return ret;
  const width = idxs[0].length;

  for (let i = 0; i < width; i++) {
    let row = '';
    for (let j = 0; j < height; j++) {
      row += CHARACTERS[idxs[j][i]];
    }
    ret += row + '\n';
  }
  return ret;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Empty picture to create id
  const image = await prisma.picture.create({
    data: {
      dateCreated: new Date()
    },
  });

  const img = req.body;
  const imgData = img.split(',').pop()

  const chunkIdx = await getIdxs(imgData);
  const result = constructString(chunkIdx);

  const imageId = image.id;
  const storage = getStorage(app);
  const newImageRef = ref(storage, `images/${imageId}`);
  try {
    const snapshot = await uploadString(newImageRef, img, 'data_url');
    await prisma.picture.update({
      where: {
        id: imageId
      },
      data: {
        url: `gs://${snapshot.metadata.bucket}/${snapshot.metadata.fullPath}`,
        translated: result,
      }
    })
  } catch (err) {
    console.log('error:', err);
  }
  console.log(result);
  res.status(200).json({ result });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

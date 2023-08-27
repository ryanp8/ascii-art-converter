import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../prisma";


export function createAccessToken(userId: string, username: string): string {
  return jwt.sign(
    { data: `${userId};${username}` },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "30m" }
  );
}

export function createRefreshToken(userId: string, username: string): string {
  return jwt.sign(
    { data: `${userId};${username}` },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "3d" }
  );
}

export function verify(token: string, type: string): JwtPayload {
  const secret = type === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  return jwt.verify(
    token,
    secret as string
  ) as JwtPayload;
}

export async function verifyUserRefreshToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || !user.refreshToken) return false;
  return verify(user.refreshToken, "refresh")
}

export function extractAccessTokenCookie(cookies: string) {
  for (const cookie of cookies.split(";")) {
    const split = cookie.split("=");
    if (split[0].trim() === "accessToken") {
      return split[1];
    }
  }
  return null;
}

export function parseDecodedToken(token: string) {
  const split = token.split(";");
  return {
    userId: split[0],
    username: split[1]
  };
}
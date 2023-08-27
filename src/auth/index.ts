import jwt from "jsonwebtoken"

export function createAccessToken(username: string): string {
  return jwt.sign(
    { data: username },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '30m' }
  );
}

export function createRefreshToken(username: string): string {
  return jwt.sign(
    { data: username },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '3d' }
  );
}

export function verify(token: string): boolean {
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    return true;
  } catch {
    return false
  }
}
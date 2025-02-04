import { JWTPayload } from 'jose';
import { verify } from './jwt.ts';
import { HttpError } from './http.ts';

export default async function authenticate(req: Request): Promise<JWTPayload> {
  const token = req.headers.get("Authorization")?.trim().split(" ")?.[1].trim();
  if (!token) {
    throw new HttpError(401, "Unauthorized");
  }
  try {
    return await verify(token) as JWTPayload;
  } catch (_) {
    throw new HttpError(401, "Unauthorized");
  }
}

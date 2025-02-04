import { jwtVerify, SignJWT } from "npm:jose";
import type { JWTPayload } from "npm:jose";

const secret = () => {
  const secret = Deno.env.get("KV_SECRET");
  if (!secret) {
    throw new Error("KV_SECRET is required");
  }
  if (secret.length < 32) {
    throw new Error("KV_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(Deno.env.get("KV_SECRET"));
};

export function generate(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret());
}

export async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch (_) {
    return null;
  }
}

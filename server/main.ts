/**
 * Example for simple minimal http-kv RPC server
 *
 * run with `deno run --allow-net --allow-env --unstable-kv server/main.ts`
 * required env vars:
 * - KV_SECRET
 */
import { type JWTPayload, jwtVerify } from "npm:jose";
import dispatcher from "../dispatcher.ts";

async function authenticate(req: Request): Promise<JWTPayload> {
  const secret = Deno.env.get("KV_SECRET");
  if (!secret) {
    throw new Error("KV_SECRET is required");
  }
  if (secret.length < 32) {
    throw new Error("KV_SECRET must be at least 32 characters");
  }
  const token = req.headers.get("RPC_KV_AUTHORIZATION");
  if (!token) {
    throw new Error("Missing token");
  }
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(secret),
  );
  return payload;
}

const debuglog = (msg: string, ...args: unknown[]) =>
  console.log(JSON.stringify({ msg, args }));

Deno.serve(async (req) => {
  try {
    const id = await authenticate(req);
    debuglog("authenticated", id);
  } catch (e) {
    debuglog(`unauthorized request ${String(e)}`, (e as Error)?.stack);
    return new Response(null, { status: 401 });
  }
  try {
    return new Response(JSON.stringify(await dispatcher(await req.json())), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  } catch (e) {
    debuglog(String(e), (e as Error)?.stack);
    return new Response(null, { status: 500 });
  }
});

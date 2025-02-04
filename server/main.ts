/**
 * HTTP-KV server
 * run with `deno run --allow-net --allow-env --unstable-kv server/main.ts`
 * required env vars:
 * - KV_SECRET
 */
import authenticate from "../utils/auth.ts";
import { errorCode, json } from "../utils/http.ts";
import { debuglog, errorlog } from "../utils/log.ts";
import kv from "../kv/server-kv.ts";
import { errorString } from "../utils/error.ts";

Deno.serve({ port: 3000 }, async (req) => {
  try {
    const p = await authenticate(req);
    debuglog("authenticated request", p);
    return json(kv(await req.json()));
  } catch (e) {
    errorlog("kv error", errorString(e));
    return json({ ok: false }, errorCode(e));
  }
});

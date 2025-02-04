// todo complete me
export type KvPublicApi = keyof Deno.Kv;

export type KvCommand<CMD extends KvPublicApi = KvPublicApi, ARGS = unknown[]> = { cmd: CMD; args: ARGS };

export type KvGetCommand = KvCommand<"get", [Deno.KvKey, { consistency?: Deno.KvConsistencyLevel }?]>;
export type KvSetCommand = KvCommand<"set", [Deno.KvKey, unknown, { expireIn?: number }?]>;


function isObject(o: unknown): o is Record<string, unknown> {
  return typeof o === "object" && o !== null;
}

function isString(o: unknown): o is string {
  return typeof o === "string";
}

export function isKvCommand(o: unknown): o is KvCommand {
  return isObject(o) &&
      isString(o.cmd) &&
      ["get", "set"].includes(o.cmd);
}

export function isKvGetCommand(o: unknown): o is KvGetCommand {
  return isKvCommand(o) && o.cmd === "get";
}

export function isKvSetCommand(o: unknown): o is KvSetCommand {
  return isKvCommand(o) && o.cmd === "set";
}

//
// export class KvError extends Error {
//   constructor(readonly status: number, message: string) {
//     super(message);
//     if (![4040, 5000].includes(status)) {
//       throw new Error("Invalid status code");
//     }
//   }
//
//   get HTTPStatusCode() {
//     return this.status / 10;
//   }
// }

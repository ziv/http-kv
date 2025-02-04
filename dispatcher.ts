type KvMethods = keyof Deno.Kv;
export type Dispatched<T> = Deno.KvEntryMaybe<T> | Deno.KvCommitResult | void;
export type KvCommand<C extends KvMethods = KvMethods, A = unknown[]> = {
  cmd: C;
  args: A;
};

const isKvCommand = (o: unknown): o is KvCommand =>
  typeof o === "object" &&
  o !== null &&
  "cmd" in o &&
  "args" in o &&
  typeof o.cmd === "string" &&
  Array.isArray(o.args);

type KvGetCommand = KvCommand<
  "get",
  [Deno.KvKey, { consistency?: Deno.KvConsistencyLevel }?]
>;
const isKvGetCommand = (o: unknown): o is KvGetCommand =>
  isKvCommand(o) && o.cmd === "get";

export type KvSetCommand = KvCommand<
  "set",
  [Deno.KvKey, unknown, { expireIn?: number }?]
>;
const isKvSetCommand = (o: unknown): o is KvSetCommand =>
  isKvCommand(o) && o.cmd === "set";

export type KvDeleteCommand = KvCommand<"delete", [Deno.KvKey]>;
const isKvDeleteCommand = (o: unknown): o is KvDeleteCommand =>
  isKvCommand(o) && o.cmd === "delete";

async function single<T>(f: (db: Deno.Kv) => Promise<T>) {
  const db = await Deno.openKv();
  const ret = await f(db);
  db.close();
  return ret as T;
}

export default function dispatcher<T>(
  command: KvCommand,
): Promise<Dispatched<T>> {
  if (isKvGetCommand(command)) {
    return single((db) => db.get(...command.args));
  }
  if (isKvSetCommand(command)) {
    return single((db) => db.set(...command.args));
  }
  if (isKvDeleteCommand(command)) {
    return single((db) => db.delete(...command.args));
  }
  throw new Error("Unrecognized command");
}

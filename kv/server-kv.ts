import { isKvCommand, isKvDeleteCommand, isKvGetCommand, isKvSetCommand, type KvCommand } from "./kv.ts";

async function run(f: (db: Deno.Kv) => Promise<unknown>) {
  const db = await Deno.openKv();
  const ret = await f(db);
  db.close();
  return ret;
}

export default function kv(command: KvCommand) {
  if (!isKvCommand(command)) {
    throw new Error("Invalid command");
  }
  if (isKvGetCommand(command)) {
    return run((db) => db.get(...command.args));
  }
  if (isKvSetCommand(command)) {
    return run((db) => db.set(...command.args));
  }
  if (isKvDeleteCommand(command)) {
    return run((db) => db.delete(...command.args));
  }
  throw new Error("Unknown command");
}

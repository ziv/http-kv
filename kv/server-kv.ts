import { isKvCommand, isKvGetCommand, isKvSetCommand, type KvCommand } from './kv.ts';

export default async function kv(command: KvCommand) {
  if (!isKvCommand(command)) {
    throw new Error("Invalid command");
  }
  if (isKvGetCommand(command)) {
    const [key, options] = command.args;
    const db = await Deno.openKv();
    return db.get(key, options);
  }
  if (isKvSetCommand(command)) {
    const [key, value, options] = command.args;
    const db = await Deno.openKv();
    return await db.set(key, value, options);
  }
  throw new Error("Unknown command");
}

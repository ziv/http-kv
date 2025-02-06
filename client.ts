export type KvMethods = keyof Deno.Kv;
export type KvCommand<C extends KvMethods = KvMethods, A = unknown[]> = { cmd: C; args: A };

export default class HttpKv implements Pick<Deno.Kv, "get" | "set" | "delete"> {
  private readonly request: <T>(rpc: KvCommand) => Promise<T>;

  constructor(url: string, token: string) {
    this.request = <T>(rpc: KvCommand): Promise<T> =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify(rpc),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json() as Promise<T>);
  }

  get<T = unknown>(
    key: Deno.KvKey,
    options?: { consistency?: Deno.KvConsistencyLevel },
  ): Promise<Deno.KvEntryMaybe<T>> {
    return this.request({ cmd: "get", args: [key, options] });
  }

  set(
    key: Deno.KvKey,
    value: unknown,
    options?: { expireIn?: number },
  ): Promise<Deno.KvCommitResult> {
    return this.request({ cmd: "set", args: [key, value, options] });
  }

  delete(key: Deno.KvKey): Promise<void> {
    return this.request({ cmd: "delete", args: [key] });
  }
}

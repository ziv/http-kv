export function errorString(e: unknown) {
  return (e as Error)?.message ?? String(e);
}

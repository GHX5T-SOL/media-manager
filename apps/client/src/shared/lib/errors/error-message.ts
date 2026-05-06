/**
 * Extracts a user-facing message from an unknown thrown value, falling back
 * to a caller-supplied default. Handles three common shapes:
 *  - `Error` instances (uses `.message`).
 *  - Plain objects with a string `.message` (e.g. better-auth error envelopes
 *    that aren't actual `Error` instances).
 *  - Anything else, including `null` / primitives — returns the fallback.
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

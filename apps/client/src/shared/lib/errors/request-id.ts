export const REQUEST_ID_HEADER = "X-Request-Id";

/** Generates a fresh request id, preferring `crypto.randomUUID()` and falling back
 *  to a base36-random + timestamp combo for environments without it. */
export function newRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rid_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** Returns a reasonable short form for display ("Ref: 7f3a2b1c"). */
export function shortRequestId(requestId: string): string {
  return requestId.replace(/-/g, "").slice(0, 8);
}

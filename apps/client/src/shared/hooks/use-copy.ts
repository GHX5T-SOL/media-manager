import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns a `copied` flag and a `copy(value)` function. After a successful
 * `navigator.clipboard.writeText`, `copied` flips to `true` and resets after
 * `resetMs`. Failures are swallowed silently — the Clipboard API rejects in
 * insecure contexts and when the document is not focused, neither of which
 * the caller should crash on.
 */
export function useCopy(resetMs = 1500): {
  copied: boolean;
  copy: (value: string) => Promise<void>;
} {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, resetMs);
      } catch {
        // Clipboard API unavailable in insecure contexts.
      }
    },
    [resetMs],
  );

  return { copied, copy };
}

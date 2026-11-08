import { useState, useEffect } from "react";
import type { SiteContent } from "../types";
import { DEFAULT_CONTENT } from "../../../services/content";

/**
 * Resilient hook for fetching practice content with fallback defaults.
 */
export function usePracticeContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) {
          setContent({ ...DEFAULT_CONTENT, ...data });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setContent(DEFAULT_CONTENT);
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  return { content, loading, error };
}

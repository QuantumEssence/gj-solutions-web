import { useEffect, useRef, useCallback } from 'react';

interface UseAdminIdleTimeoutOptions {
  timeoutMs?: number; // Defaults to 30 minutes (30 * 60 * 1000)
  onTimeout: () => void;
  isAuthenticated: boolean;
}

export const useAdminIdleTimeout = ({
  timeoutMs = 30 * 60 * 1000,
  onTimeout,
  isAuthenticated
}: UseAdminIdleTimeoutOptions) => {
  const lastActivityRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    lastActivityRef.current = Date.now();

    // Throttle event handlers to avoid performance hits
    let lastHandled = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastHandled > 2000) {
        lastHandled = now;
        resetTimer();
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    for (const evt of events) {
      window.addEventListener(evt, handleActivity, { passive: true });
    }

    // Check every 15 seconds if session has expired
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= timeoutMs) {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onTimeout();
      }
    }, 15000);

    return () => {
      for (const evt of events) {
        window.removeEventListener(evt, handleActivity);
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, timeoutMs, onTimeout, resetTimer]);
};

export default useAdminIdleTimeout;

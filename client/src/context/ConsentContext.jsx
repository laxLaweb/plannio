import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "plannio.cookie-consent";

const ConsentContext = createContext(null);

function readStoredConsent() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(readStoredConsent);

  const persist = useCallback((value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors (private mode etc.) — consent still applies for this session
    }
    setConsent(value);
  }, []);

  const acceptAll = useCallback(() => persist("granted"), [persist]);
  const rejectAll = useCallback(() => persist("denied"), [persist]);

  const resetConsent = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConsent(null);
  }, []);

  const value = useMemo(
    () => ({ consent, acceptAll, rejectAll, resetConsent }),
    [consent, acceptAll, rejectAll, resetConsent],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}

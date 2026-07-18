import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

/**
 * On first mount, try to silently exchange the httpOnly refresh cookie for
 * a fresh access token — this is what makes "stay logged in" work across
 * page reloads without ever putting the access token in localStorage.
 * Renders children immediately either way; consumers read `status` from
 * useAuthStore to decide whether to show a loading state.
 */
export function AuthProvider({ children }) {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    authService
      .refresh()
      .then((res) => {
        if (cancelled) return;
        setSession(res.data.user, res.data.accessToken);
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
      });

    return () => {
      cancelled = true;
    };
  }, [setStatus, setSession, clearSession]);

  return children;
}

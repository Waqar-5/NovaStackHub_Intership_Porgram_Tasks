import { create } from "zustand";

/**
 * Deliberately NOT persisted to localStorage: the access token lives in
 * memory only, so a page refresh clears it and AuthProvider silently
 * re-hydrates via the httpOnly refresh-token cookie. This keeps the token
 * out of reach of any XSS payload that can read localStorage.
 */
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  status: "idle", // idle | loading | authenticated | unauthenticated

  setSession(user, accessToken) {
    set({ user, accessToken, status: "authenticated" });
  },
  clearSession() {
    set({ user: null, accessToken: null, status: "unauthenticated" });
  },
  setStatus(status) {
    set({ status });
  },
}));

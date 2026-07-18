import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || status === "idle",
    role: user?.role ?? null,
  };
}

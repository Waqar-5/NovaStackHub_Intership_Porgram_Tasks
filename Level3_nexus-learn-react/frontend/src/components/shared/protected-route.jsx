import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Wrap a role's route with this. Redirects to /login if not authenticated,
 * or to /unauthorized if authenticated but the wrong role — never renders
 * the protected content in either case, even briefly, because the loading
 * state is checked first.
 */
export function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      navigate("/unauthorized", { replace: true });
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass rounded-lg px-6 py-4 text-sm text-muted-foreground">
          Checking your session…
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return null;
  }

  return children;
}

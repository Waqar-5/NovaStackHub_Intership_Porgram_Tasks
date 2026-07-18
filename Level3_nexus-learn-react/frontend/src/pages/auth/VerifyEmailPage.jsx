import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [state, setState] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    authService
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) setState("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setMessage(err.response?.data?.message || "Verification link is invalid or has expired.");
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="space-y-4 text-center">
      {state === "verifying" && (
        <>
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <h1 className="font-display text-2xl font-bold">Verifying your email…</h1>
        </>
      )}

      {state === "success" && (
        <>
          <CheckCircle2 className="mx-auto size-8 text-success" />
          <h1 className="font-display text-2xl font-bold">Email verified</h1>
          <p className="text-sm text-muted-foreground">Your account is now active.</p>
          <Button asChild className="w-full">
            <Link to="/login">Log in</Link>
          </Button>
        </>
      )}

      {state === "error" && (
        <>
          <XCircle className="mx-auto size-8 text-danger" />
          <h1 className="font-display text-2xl font-bold">Verification failed</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to login</Link>
          </Button>
        </>
      )}
    </div>
  );
}

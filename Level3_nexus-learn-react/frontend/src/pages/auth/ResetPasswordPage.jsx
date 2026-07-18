import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordFormSchema } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values) {
    setServerError("");
    try {
      await authService.resetPassword(token, values.password);
      setDone(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "This reset link is invalid or has expired."
      );
    }
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-bold">Password updated</h1>
        <p className="text-sm text-muted-foreground">
          You can now log in with your new password.
        </p>
        <Button className="w-full" onClick={() => navigate("/login")}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

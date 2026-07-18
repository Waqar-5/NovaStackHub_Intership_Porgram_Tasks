import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerFormSchema } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  async function onSubmit(values) {
    setServerError("");
    try {
      const { confirmPassword: _confirmPassword, ...payload } = values;
      await authService.register(payload);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your inbox. Confirm your email to activate your
          account, then log in.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start learning or teaching today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Waqar Ahmed" {...register("name")} />
          {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            <label className="glass flex cursor-pointer items-center justify-center rounded-md border border-transparent p-2 text-sm has-[:checked]:border-primary has-[:checked]:text-primary">
              <input type="radio" value="student" className="sr-only" {...register("role")} />
              Student
            </label>
            <label className="glass flex cursor-pointer items-center justify-center rounded-md border border-transparent p-2 text-sm has-[:checked]:border-primary has-[:checked]:text-primary">
              <input type="radio" value="teacher" className="sr-only" {...register("role")} />
              Teacher
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
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
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

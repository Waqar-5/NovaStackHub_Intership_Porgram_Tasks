import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <ShieldAlert className="size-10 text-warning" />
      <h1 className="font-display text-2xl font-bold">You don&apos;t have access to this page</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your account role doesn&apos;t have permission to view this. If you think this is a
        mistake, contact an administrator.
      </p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </main>
  );
}

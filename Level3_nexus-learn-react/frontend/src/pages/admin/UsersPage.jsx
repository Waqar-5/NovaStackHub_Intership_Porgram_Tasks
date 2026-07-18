import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, MoreVertical, Check, Ban, Trash2, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/adminService";
import { cn } from "@/lib/utils";

const ROLES = ["student", "teacher", "admin"];

function ConfirmButton({ label, icon: Icon, onConfirm, variant = "outline", danger }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button size="sm" variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant={variant}
      className={danger ? "text-danger hover:bg-danger/10" : undefined}
      onClick={() => setConfirming(true)}
    >
      <Icon className="size-3.5" /> {label}
    </Button>
  );
}

function UserRow({ user, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function run(action) {
    setBusy(true);
    try {
      await action();
      onChanged();
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs capitalize",
            user.status === "active" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}
        >
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {user.role === "teacher" &&
          (user.teacherProfile?.approved ? "Approved" : "Pending approval")}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {user.role === "teacher" && !user.teacherProfile?.approved && (
            <Button size="sm" variant="outline" onClick={() => run(() => adminService.approveTeacher(user._id))}>
              <Check className="size-3.5" /> Approve
            </Button>
          )}
          {user.status === "active" ? (
            <ConfirmButton
              label="Suspend"
              icon={Ban}
              onConfirm={() => run(() => adminService.suspendUser(user._id))}
            />
          ) : (
            <Button size="sm" variant="outline" onClick={() => run(() => adminService.reactivateUser(user._id))}>
              Reactivate
            </Button>
          )}
          <div className="relative">
            <Button size="sm" variant="ghost" onClick={() => setMenuOpen((v) => !v)}>
              <MoreVertical className="size-3.5" />
            </Button>
            {menuOpen && (
              <div className="glass absolute right-0 z-20 mt-1 w-40 rounded-md p-1">
                {ROLES.filter((r) => r !== user.role).map((role) => (
                  <button
                    key={role}
                    onClick={() => run(() => adminService.setUserRole(user._id, role))}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-glass"
                  >
                    <ShieldCheck className="size-3.5" /> Make {role}
                  </button>
                ))}
                <button
                  onClick={() => run(() => adminService.deleteUser(user._id))}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-danger hover:bg-danger/10"
                >
                  <Trash2 className="size-3.5" /> Delete account
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AdminUsersPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { role, status, search }],
    queryFn: () =>
      adminService.listUsers({
        role: role || undefined,
        status: status || undefined,
        search: search || undefined,
        limit: 50,
      }),
  });
  const users = data?.data?.users || [];

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Users</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="glass rounded-md px-3 py-2 text-sm capitalize"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="glass rounded-md px-3 py-2 text-sm capitalize"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : users.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No users match those filters.
        </div>
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <UserRow key={u._id} user={u} onChanged={refresh} />
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}

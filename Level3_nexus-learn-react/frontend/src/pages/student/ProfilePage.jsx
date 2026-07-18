import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/brand-icons";
import { AvatarUploader } from "@/components/shared/avatar-uploader";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { profileService } from "@/services/profileService";

export default function ProfilePage() {
  const { user } = useAuth();
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.studentProfile?.bio || "");
  const [phone, setPhone] = useState(user?.studentProfile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await profileService.update({
        name,
        studentProfile: { bio, phone },
      });
      setSession(res.data.user, accessToken);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Your profile</h1>

      <GlassCard>
        <div className="flex items-center gap-4">
          <AvatarUploader user={user} />
          <div>
            <p className="font-display text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs capitalize text-primary">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-3 text-muted-foreground">
          <GithubIcon className="size-4" />
          <LinkedinIcon className="size-4" />
          <Globe className="size-4" />
          <span className="text-xs">Social links — coming soon</span>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display font-semibold">Edit profile</h2>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
              placeholder="A little about you..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
            {saved && <span className="text-sm text-success">Saved.</span>}
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

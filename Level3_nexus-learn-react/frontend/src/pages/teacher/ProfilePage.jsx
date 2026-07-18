import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, X } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { AvatarUploader } from "@/components/shared/avatar-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { profileService } from "@/services/profileService";

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.teacherProfile?.bio || "");
  const [expertise, setExpertise] = useState(user?.teacherProfile?.expertise || []);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addSkill(e) {
    e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !expertise.includes(skill)) {
      setExpertise([...expertise, skill]);
    }
    setNewSkill("");
  }

  function removeSkill(skill) {
    setExpertise(expertise.filter((s) => s !== skill));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await profileService.update({
        name,
        teacherProfile: { bio, expertise },
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
      <h1 className="font-display text-3xl font-bold">Your professional profile</h1>

      <GlassCard>
        <div className="flex items-center gap-4">
          <AvatarUploader user={user} />
          <div>
            <p className="font-display text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-warning text-warning" />
              {user?.teacherProfile?.approved ? "Approved teacher" : "Pending approval"}
            </span>
          </div>
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
              placeholder="Your background and teaching focus..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skill">Areas of expertise</Label>
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill) => (
                <span
                  key={skill}
                  className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="skill"
                placeholder="e.g. React, System Design"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
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

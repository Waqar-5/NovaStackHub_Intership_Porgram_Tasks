import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { profileService } from "@/services/profileService";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUploader({ user }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const res = await profileService.uploadAvatar(file);
      setSession(res.data.user, accessToken);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    } catch (err) {
      setError(
        err.response?.status === 503
          ? "Image uploads aren't set up on this server yet (Cloudinary isn't configured)."
          : err.response?.data?.message || "Upload failed. Try a different image."
      );
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  }

  const displayUrl = preview || user?.avatarUrl;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full gradient-signature font-display text-xl font-bold text-white"
        aria-label="Change profile picture"
      >
        {displayUrl ? (
          <img src={displayUrl} alt="" className="size-full object-cover" />
        ) : (
          user?.name?.[0]?.toUpperCase()
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-white" />
          ) : (
            <Camera className="size-5 text-white" />
          )}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="mt-2 max-w-[200px] text-xs text-danger">{error}</p>}
    </div>
  );
}

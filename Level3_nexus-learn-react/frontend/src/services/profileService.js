import { api } from "@/lib/axios";

export const profileService = {
  update: (payload) => api.patch("/users/me", payload).then((r) => r.data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api
      .post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  toggleWishlist: (courseId) =>
    api.post("/users/me/wishlist", { courseId }).then((r) => r.data),
  toggleBookmark: (lessonId) =>
    api.post("/users/me/bookmarks", { lessonId }).then((r) => r.data),
};

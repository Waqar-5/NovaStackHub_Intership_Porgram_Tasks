import { api } from "@/lib/axios";

export const announcementService = {
  mine: () => api.get("/announcements").then((r) => r.data),
  create: (payload) => api.post("/announcements", payload).then((r) => r.data),
};

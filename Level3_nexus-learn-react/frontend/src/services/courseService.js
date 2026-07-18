import { api } from "@/lib/axios";

export const courseService = {
  list: (params) => api.get("/courses", { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/courses/${slug}`).then((r) => r.data),
  getById: (id) => api.get(`/courses/id/${id}`).then((r) => r.data),
};

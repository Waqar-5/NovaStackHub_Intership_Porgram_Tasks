import { api } from "@/lib/axios";

export const adminService = {
  overview: () => api.get("/admin/overview").then((r) => r.data),
  growth: () => api.get("/admin/growth").then((r) => r.data),
  popularity: () => api.get("/admin/popularity").then((r) => r.data),
  analytics: () => api.get("/admin/analytics").then((r) => r.data),

  listUsers: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  getUser: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  suspendUser: (id) => api.patch(`/admin/users/${id}/suspend`).then((r) => r.data),
  reactivateUser: (id) => api.patch(`/admin/users/${id}/reactivate`).then((r) => r.data),
  approveTeacher: (id) => api.patch(`/admin/users/${id}/approve-teacher`).then((r) => r.data),
  setUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),

  listAllCourses: (params) => api.get("/admin/courses", { params }).then((r) => r.data),
  setCourseStatus: (id, status) =>
    api.patch(`/admin/courses/${id}/status`, { status }).then((r) => r.data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`).then((r) => r.data),

  createCategory: (payload) => api.post("/admin/categories", payload).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data),
};

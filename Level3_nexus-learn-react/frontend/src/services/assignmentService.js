import { api } from "@/lib/axios";

export const assignmentService = {
  upcoming: () => api.get("/assignments/upcoming").then((r) => r.data),
  forCourse: (courseId) =>
    api.get(`/assignments/course/${courseId}`).then((r) => r.data),
  submit: (payload) => api.post("/assignments/submit", payload).then((r) => r.data),
};

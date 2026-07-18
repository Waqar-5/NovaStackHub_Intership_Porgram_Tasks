import { api } from "@/lib/axios";

export const enrollmentService = {
  enroll: (courseId) => api.post("/enrollments", { courseId }).then((r) => r.data),
  myEnrollments: () => api.get("/enrollments/me").then((r) => r.data),
  getForCourse: (courseId) =>
    api.get(`/enrollments/course/${courseId}`).then((r) => r.data),
  markLessonComplete: (enrollmentId, lessonId) =>
    api
      .patch(`/enrollments/${enrollmentId}/progress`, { lessonId })
      .then((r) => r.data),
};

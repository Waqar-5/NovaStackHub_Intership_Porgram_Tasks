import { api } from "@/lib/axios";

export const teacherService = {
  overview: () => api.get("/teacher/overview").then((r) => r.data),
  performance: () => api.get("/teacher/performance").then((r) => r.data),

  myCourses: () => api.get("/teacher/courses").then((r) => r.data),
  getCourse: (id) => api.get(`/teacher/courses/${id}`).then((r) => r.data),
  createCourse: (payload) => api.post("/teacher/courses", payload).then((r) => r.data),
  updateCourse: (id, payload) =>
    api.patch(`/teacher/courses/${id}`, payload).then((r) => r.data),
  setCourseStatus: (id, status) =>
    api.patch(`/teacher/courses/${id}/status`, { status }).then((r) => r.data),
  addModule: (id, title) =>
    api.post(`/teacher/courses/${id}/modules`, { title }).then((r) => r.data),
  addLesson: (id, moduleId, payload) =>
    api.post(`/teacher/courses/${id}/modules/${moduleId}/lessons`, payload).then((r) => r.data),
  roster: (id) => api.get(`/teacher/courses/${id}/roster`).then((r) => r.data),

  createAssignment: (payload) => api.post("/teacher/assignments", payload).then((r) => r.data),
  createQuiz: (payload) => api.post("/teacher/quizzes", payload).then((r) => r.data),

  pendingSubmissions: () => api.get("/teacher/submissions/pending").then((r) => r.data),
  gradeSubmission: (submissionId, payload) =>
    api.patch(`/teacher/submissions/${submissionId}/grade`, payload).then((r) => r.data),

  markAttendance: (payload) => api.post("/teacher/attendance", payload).then((r) => r.data),
  attendanceForDate: (courseId, date) =>
    api.get(`/teacher/attendance/${courseId}`, { params: { date } }).then((r) => r.data),
};

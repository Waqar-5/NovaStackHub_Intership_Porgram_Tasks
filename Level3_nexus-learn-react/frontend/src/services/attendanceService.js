import { api } from "@/lib/axios";

export const attendanceService = {
  mine: (courseId) =>
    api.get("/attendance/me", { params: courseId ? { courseId } : {} }).then((r) => r.data),
};

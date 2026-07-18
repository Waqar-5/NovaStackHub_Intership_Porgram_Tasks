import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

export const myAttendance = asyncHandler(async (req, res) => {
  const filter = { student: req.user._id };
  if (req.query.courseId) filter.course = req.query.courseId;

  const records = await Attendance.find(filter)
    .populate("course", "title slug")
    .sort({ date: -1 });

  const summary = records.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, leave: 0, total: 0 }
  );

  return apiSuccess(res, {
    message: "Attendance fetched.",
    data: { records, summary },
  });
});

async function assertOwnsCourse(courseId, teacherId) {
  const owned = await Course.exists({ _id: courseId, instructor: teacherId });
  if (!owned) throw new ApiError(403, "That course isn't yours to manage");
}

export const markAttendance = asyncHandler(async (req, res) => {
  const { courseId, date, records } = req.body;
  await assertOwnsCourse(courseId, req.user._id);

  // Upsert each record — re-marking the same student/course/date corrects
  // it rather than creating a duplicate (the model has a unique compound
  // index on exactly this combination).
  const results = await Promise.all(
    records.map(({ studentId, status }) =>
      Attendance.findOneAndUpdate(
        { course: courseId, student: studentId, date },
        { status, markedBy: req.user._id },
        { upsert: true, new: true, runValidators: true }
      )
    )
  );

  return apiSuccess(res, { message: "Attendance marked.", data: { records: results } });
});

export const courseAttendanceForDate = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  await assertOwnsCourse(courseId, req.user._id);

  const filter = { course: courseId };
  if (req.query.date) {
    const day = new Date(req.query.date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    filter.date = { $gte: day, $lt: nextDay };
  }

  const records = await Attendance.find(filter).populate("student", "name email");
  return apiSuccess(res, { message: "Attendance fetched.", data: { records } });
});

import mongoose from 'mongoose';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { mockCourses, mockUsers } from '../data/mockData.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper: attach a logged-in user's progress onto a course object (mock mode only;
// in DB mode this would come from a populated User.enrolledCourses lookup).
function withMockProgress(course) {
  const enrollment = mockUsers[0].enrolledCourses.find((e) => e.course === course._id);
  return {
    ...course,
    progress: enrollment?.progress || 0,
  };
}

export async function getAllCourses(req, res, next) {
  try {
    if (!isDbConnected()) {
      return res.json(mockCourses.map(withMockProgress));
    }

    const courses = await Course.find().select('-modules.lessons.content');
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

export async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      const course = mockCourses.find((c) => c._id === id);
      if (!course) return res.status(404).json({ message: 'Course not found.' });
      return res.json(withMockProgress(course));
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

export async function getEnrolledCourses(req, res, next) {
  try {
    if (!isDbConnected()) {
      const enrolled = mockCourses
        .map(withMockProgress)
        .filter((c) => c.progress > 0);
      return res.json(enrolled);
    }

    const user = await User.findById(req.userId).populate('enrolledCourses.course');
    const enrolled = user.enrolledCourses.map((e) => ({
      ...e.course.toObject(),
      progress: e.progress,
    }));
    res.json(enrolled);
  } catch (err) {
    next(err);
  }
}

export async function enrollInCourse(req, res, next) {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.json({ success: true, courseId: id });
    }

    const user = await User.findById(req.userId);
    const alreadyEnrolled = user.enrolledCourses.some((e) => e.course.toString() === id);

    if (!alreadyEnrolled) {
      user.enrolledCourses.push({ course: id, progress: 0, completedLessons: [] });
      await user.save();
      await Course.findByIdAndUpdate(id, { $inc: { studentsEnrolled: 1 } });
    }

    res.json({ success: true, courseId: id });
  } catch (err) {
    next(err);
  }
}

export async function markLessonComplete(req, res, next) {
  try {
    const { id: courseId, lessonId } = req.params;

    if (!isDbConnected()) {
      return res.json({ success: true, courseId, lessonId });
    }

    const user = await User.findById(req.userId);
    const enrollment = user.enrolledCourses.find((e) => e.course.toString() === courseId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course.' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(courseId);
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

    await user.save();
    res.json({ success: true, progress: enrollment.progress });
  } catch (err) {
    next(err);
  }
}

export async function searchCourses(req, res, next) {
  try {
    const { q, category } = req.query;

    if (!isDbConnected()) {
      let results = mockCourses.map(withMockProgress);
      if (q) {
        const lower = q.toLowerCase();
        results = results.filter(
          (c) =>
            c.title.toLowerCase().includes(lower) ||
            c.instructorName.toLowerCase().includes(lower)
        );
      }
      if (category && category !== 'All') {
        results = results.filter((c) => c.category === category);
      }
      return res.json(results);
    }

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category && category !== 'All') filter.category = category;

    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

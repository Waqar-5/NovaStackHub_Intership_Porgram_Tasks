import express from 'express';
import {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  enrollInCourse,
  markLessonComplete,
  searchCourses,
} from '../controllers/courseController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Note: in mock mode (no MONGODB_URI set) these routes work without a
// valid token too, but requireAuth is left in place so behavior matches
// production once a real database and real users exist.

router.get('/search', searchCourses);
router.get('/enrolled', requireAuth, getEnrolledCourses);
router.get('/:id', getCourseById);
router.get('/', getAllCourses);
router.post('/:id/enroll', requireAuth, enrollInCourse);
router.post('/:id/lessons/:lessonId/complete', requireAuth, markLessonComplete);

export default router;

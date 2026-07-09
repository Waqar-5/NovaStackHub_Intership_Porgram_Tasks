import { USE_MOCK_DATA, mockDelay, apiRequest } from './apiClient';
import { courses as mockCourses, getCourseById as mockGetCourseById } from '../data/courses';

/**
 * Course service — every page imports from here, never from /data directly.
 * This is the single seam where mock data gets swapped for live API calls.
 */

export async function fetchAllCourses() {
  if (USE_MOCK_DATA) return mockDelay(mockCourses);
  return apiRequest('/courses');
}

export async function fetchCourseById(courseId) {
  if (USE_MOCK_DATA) return mockDelay(mockGetCourseById(courseId));
  return apiRequest(`/courses/${courseId}`);
}

export async function fetchEnrolledCourses() {
  if (USE_MOCK_DATA) return mockDelay(mockCourses.filter((c) => c.progress > 0));
  return apiRequest('/courses/enrolled');
}

export async function enrollInCourse(courseId) {
  if (USE_MOCK_DATA) return mockDelay({ success: true, courseId });
  return apiRequest(`/courses/${courseId}/enroll`, { method: 'POST' });
}

export async function markLessonComplete(courseId, lessonId) {
  if (USE_MOCK_DATA) return mockDelay({ success: true, courseId, lessonId });
  return apiRequest(`/courses/${courseId}/lessons/${lessonId}/complete`, { method: 'POST' });
}

export async function searchCourses(query, category) {
  if (USE_MOCK_DATA) {
    const filtered = mockCourses.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || category === 'All' || c.category === category;
      return matchesQuery && matchesCategory;
    });
    return mockDelay(filtered);
  }

  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category && category !== 'All') params.set('category', category);
  return apiRequest(`/courses/search?${params.toString()}`);
}

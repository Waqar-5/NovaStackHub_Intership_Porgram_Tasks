// Fallback in-memory dataset used only when MONGODB_URI is not configured.
// This lets the API run and be tested immediately without requiring a
// database connection. Once MongoDB is connected, controllers should query
// the Mongoose models in src/models/ instead — see the comments in each
// controller for exactly where that swap happens.

export const mockCourses = [
  {
    _id: 'c001',
    title: 'Modern JavaScript Foundations',
    instructorName: 'Ayesha Raza',
    category: 'Web Development',
    level: 'Beginner',
    duration: '6h 20m',
    rating: 4.8,
    studentsEnrolled: 1842,
    price: 0,
    thumbnail: '🟨',
    description:
      'Build a rock-solid foundation in JavaScript through hands-on exercises rather than passive video watching.',
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          { _id: 'l1', title: 'Why JavaScript', duration: '8m', type: 'video' },
          { _id: 'l2', title: 'Setting Up Your Environment', duration: '12m', type: 'video' },
        ],
      },
    ],
  },
  {
    _id: 'c002',
    title: 'React for Practical Builders',
    instructorName: 'Hamza Tariq',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '9h 45m',
    rating: 4.9,
    studentsEnrolled: 2310,
    price: 0,
    thumbnail: '🟦',
    description: 'Skip the theory-heavy detours. Learn React by shipping three real projects.',
    modules: [
      {
        title: 'React Fundamentals',
        lessons: [
          { _id: 'l1', title: 'Components & JSX', duration: '14m', type: 'video' },
          { _id: 'l2', title: 'Props & State', duration: '20m', type: 'video' },
        ],
      },
    ],
  },
  {
    _id: 'c003',
    title: 'Python for Data Analysis',
    instructorName: 'Sana Iqbal',
    category: 'Data Science',
    level: 'Beginner',
    duration: '7h 10m',
    rating: 4.7,
    studentsEnrolled: 1567,
    price: 0,
    thumbnail: '🟩',
    description: 'Use Python, pandas, and matplotlib to clean, analyze, and visualize real datasets.',
    modules: [
      {
        title: 'Python Essentials',
        lessons: [{ _id: 'l1', title: 'Syntax & Data Types', duration: '12m', type: 'video' }],
      },
    ],
  },
];

export const mockUsers = [
  {
    _id: 'u001',
    name: 'Waqar Ahmed',
    email: 'waqar@example.com',
    role: 'student',
    avatarInitials: 'WA',
    streak: 6,
    totalHoursLearned: 23,
    certificatesEarned: 1,
    enrolledCourses: [
      { course: 'c001', progress: 65, completedLessons: ['l1', 'l2'] },
      { course: 'c002', progress: 30, completedLessons: ['l1'] },
    ],
  },
];

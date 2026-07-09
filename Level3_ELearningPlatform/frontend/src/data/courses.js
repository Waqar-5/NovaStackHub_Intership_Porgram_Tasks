// Mock dataset standing in for a MongoDB `courses` collection.
// Shape mirrors what the backend API returns — swapping mock data for
// real fetch calls requires no changes to any component.

export const courses = [
  {
    id: 'c001',
    title: 'Modern JavaScript Foundations',
    instructor: 'Ayesha Raza',
    category: 'Web Development',
    level: 'Beginner',
    duration: '6h 20m',
    rating: 4.8,
    studentsEnrolled: 1842,
    price: 0,
    thumbnail: '🟨',
    description:
      'Build a rock-solid foundation in JavaScript — variables, functions, the DOM, and async patterns — through hands-on exercises rather than passive video watching.',
    progress: 65,
    modules: [
      {
        id: 'm1',
        title: 'Getting Started',
        lessons: [
          { id: 'l1', title: 'Why JavaScript', duration: '8m', completed: true, type: 'video' },
          { id: 'l2', title: 'Setting Up Your Environment', duration: '12m', completed: true, type: 'video' },
          { id: 'l3', title: 'Quiz: JS Basics', duration: '5m', completed: true, type: 'quiz' },
        ],
      },
      {
        id: 'm2',
        title: 'Core Language Concepts',
        lessons: [
          { id: 'l4', title: 'Variables & Data Types', duration: '15m', completed: true, type: 'video' },
          { id: 'l5', title: 'Functions & Scope', duration: '18m', completed: true, type: 'video' },
          { id: 'l6', title: 'Arrays & Objects', duration: '20m', completed: false, type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'Working with the DOM',
        lessons: [
          { id: 'l7', title: 'Selecting Elements', duration: '14m', completed: false, type: 'video' },
          { id: 'l8', title: 'Event Listeners', duration: '16m', completed: false, type: 'video' },
          { id: 'l9', title: 'Final Project Brief', duration: '6m', completed: false, type: 'assignment' },
        ],
      },
    ],
  },
  {
    id: 'c002',
    title: 'React for Practical Builders',
    instructor: 'Hamza Tariq',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '9h 45m',
    rating: 4.9,
    studentsEnrolled: 2310,
    price: 0,
    thumbnail: '🟦',
    description:
      'Skip the theory-heavy detours. Learn React by shipping three real projects: a dashboard, a form-heavy app, and a data-driven UI.',
    progress: 30,
    modules: [
      {
        id: 'm1',
        title: 'React Fundamentals',
        lessons: [
          { id: 'l1', title: 'Components & JSX', duration: '14m', completed: true, type: 'video' },
          { id: 'l2', title: 'Props & State', duration: '20m', completed: true, type: 'video' },
          { id: 'l3', title: 'Quiz: Component Basics', duration: '5m', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'm2',
        title: 'Hooks in Depth',
        lessons: [
          { id: 'l4', title: 'useState & useEffect', duration: '22m', completed: false, type: 'video' },
          { id: 'l5', title: 'Custom Hooks', duration: '18m', completed: false, type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'Routing & Data Fetching',
        lessons: [
          { id: 'l6', title: 'React Router Basics', duration: '16m', completed: false, type: 'video' },
          { id: 'l7', title: 'Fetching & Caching Data', duration: '24m', completed: false, type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'c003',
    title: 'Python for Data Analysis',
    instructor: 'Sana Iqbal',
    category: 'Data Science',
    level: 'Beginner',
    duration: '7h 10m',
    rating: 4.7,
    studentsEnrolled: 1567,
    price: 0,
    thumbnail: '🟩',
    description:
      'Use Python, pandas, and matplotlib to clean, analyze, and visualize real datasets — from CSVs to small dashboards.',
    progress: 0,
    modules: [
      {
        id: 'm1',
        title: 'Python Essentials',
        lessons: [
          { id: 'l1', title: 'Syntax & Data Types', duration: '12m', completed: false, type: 'video' },
          { id: 'l2', title: 'Loops & Conditionals', duration: '14m', completed: false, type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'Working with Pandas',
        lessons: [
          { id: 'l3', title: 'DataFrames 101', duration: '20m', completed: false, type: 'video' },
          { id: 'l4', title: 'Cleaning Messy Data', duration: '22m', completed: false, type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'c004',
    title: 'UI/UX Design Principles',
    instructor: 'Fatima Noor',
    category: 'Design',
    level: 'Beginner',
    duration: '5h 30m',
    rating: 4.6,
    studentsEnrolled: 980,
    price: 0,
    thumbnail: '🟧',
    description:
      'Learn the principles behind interfaces people actually enjoy using — hierarchy, contrast, spacing, and feedback — and apply them in Figma.',
    progress: 0,
    modules: [
      {
        id: 'm1',
        title: 'Design Foundations',
        lessons: [
          { id: 'l1', title: 'Visual Hierarchy', duration: '10m', completed: false, type: 'video' },
          { id: 'l2', title: 'Color & Contrast', duration: '12m', completed: false, type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'c005',
    title: 'Node.js & Express APIs',
    instructor: 'Hamza Tariq',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '8h 15m',
    rating: 4.8,
    studentsEnrolled: 1420,
    price: 0,
    thumbnail: '🟪',
    description:
      'Build secure, well-structured REST APIs with Node.js, Express, and MongoDB — the same architecture pattern used in this very platform.',
    progress: 0,
    modules: [
      {
        id: 'm1',
        title: 'Server Basics',
        lessons: [
          { id: 'l1', title: 'Setting Up Express', duration: '15m', completed: false, type: 'video' },
          { id: 'l2', title: 'Routing & Middleware', duration: '18m', completed: false, type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'c006',
    title: 'Intro to Machine Learning',
    instructor: 'Sana Iqbal',
    category: 'Data Science',
    level: 'Advanced',
    duration: '11h 00m',
    rating: 4.9,
    studentsEnrolled: 2105,
    price: 0,
    thumbnail: '🟥',
    description:
      'Understand the math and intuition behind core ML algorithms, then implement them from scratch and with scikit-learn.',
    progress: 0,
    modules: [
      {
        id: 'm1',
        title: 'Foundations',
        lessons: [
          { id: 'l1', title: 'What Is Machine Learning', duration: '10m', completed: false, type: 'video' },
          { id: 'l2', title: 'Linear Regression', duration: '25m', completed: false, type: 'video' },
        ],
      },
    ],
  },
];

export const categories = ['All', 'Web Development', 'Data Science', 'Design'];

export const getEnrolledCourses = () => courses.filter((c) => c.progress > 0);
export const getCourseById = (id) => courses.find((c) => c.id === id);

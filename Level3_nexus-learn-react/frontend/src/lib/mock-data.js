// Placeholder content for the marketing site. Course/teacher data becomes
// real API calls once the Course model + endpoints exist (Phase 4+); the
// shapes here already match ARCHITECTURE.md §3 so swapping the source
// later is a data-fetch change, not a component rewrite.

import AI from "../assets/images/AI.webp";
import devops from "../assets/images/devops.webp";
import UI from "../assets/images/UI_UX.avif";
import web from "../assets/images/web_image.jpg";

import T1 from "../assets/images/teacher1.webp";
import T2 from "../assets/images/teacher2.webp";
import T3 from "../assets/images/teacher3.webp";


export const stats = [
  { label: "Active learners", value: 42000, suffix: "+" },
  { label: "Expert-led courses", value: 850, suffix: "+" },
  { label: "Completion rate", value: 94, suffix: "%" },
  { label: "Countries reached", value: 63, suffix: "" },
];

export const trustedCompanies = [
  "Vertex Labs",
  "Northwind",
  "Cascade Systems",
  "Orbital",
  "Meridian",
  "Fieldstone",
  "Halcyon",
  "Ironclad",
];

export const popularCourses = [
  {
    id: "c1",
    title: "Full-Stack Web Development with the MERN Stack",
    category: "Web Development",
    instructor: "Amara Chen",
    rating: 4.9,
    students: 12400,
    price: 49,
    difficulty: "Intermediate",
    image: web
  },
  {
    id: "c2",
    title: "Modern UI/UX Design Systems",
    category: "Design",
    instructor: "Leo Martins",
    rating: 4.8,
    students: 8100,
    price: 39,
    difficulty: "Beginner",
    image: UI,
  },
  {
    id: "c3",
    title: "Machine Learning Foundations",
    category: "Data Science",
    instructor: "Priya Nair",
    rating: 4.9,
    students: 15800,
    price: 59,
    difficulty: "Advanced",
    image: AI,
  },
  {
    id: "c4",
    title: "Cloud Architecture on AWS",
    category: "DevOps",
    instructor: "Tomás Rivera",
    rating: 4.7,
    students: 6300,
    price: 54,
    difficulty: "Intermediate",
    image: devops,
  },
];

export const featuredTeachers = [
  {
    id: "t1",
    name: "Amara Chen",
    role: "Senior Full-Stack Engineer",
    students: 12400,
    rating: 4.9,
    image: T1,
  },
  {
    id: "t2",
    name: "Leo Martins",
    role: "Principal Product Designer",
    students: 8100,
    rating: 4.8,
    image: T2,
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "ML Research Lead",
    students: 15800,
    rating: 4.9,
    image: T3,
  },
];

export const testimonials = [
  {
    id: "r1",
    name: "Daniyal Farooq",
    role: "Frontend Developer at a startup",
    quote:
      "The structure took me from scattered tutorials to an actual portfolio in about ten weeks — the projects were the whole point.",
  },
  {
    id: "r2",
    name: "Hana Suzuki",
    role: "Career switcher, ex-marketing",
    quote:
      "I was worried about starting from zero. The pacing and the teacher feedback made that a non-issue.",
  },
  {
    id: "r3",
    name: "Omar El-Sayed",
    role: "Computer Science student",
    quote:
      "Assignments felt like real work, not busywork. That's the difference between a course and a certificate mill.",
  },
];

export const pricingPlans = [
  {
    id: "free",
    name: "Explorer",
    price: 0,
    period: "forever",
    description: "Try the platform with a limited course library.",
    features: ["3 free courses", "Community forum access", "Basic progress tracking"],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Learner Pro",
    price: 19,
    period: "month",
    description: "Full access for serious, ongoing learning.",
    features: [
      "Unlimited course access",
      "Certificates on completion",
      "1:1 teacher chat",
      "Downloadable resources",
      "Priority support",
    ],
    cta: "Start learning",
    highlighted: true,
  },
  {
    id: "teams",
    name: "Teams",
    price: 49,
    period: "seat / month",
    description: "For bootcamps, schools, and internal training.",
    features: [
      "Everything in Pro",
      "Batch & cohort management",
      "Attendance + grading tools",
      "Admin analytics dashboard",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export const faqs = [
  {
    question: "Do I need any prior experience to start?",
    answer:
      "No. Courses are tagged by difficulty (Beginner/Intermediate/Advanced) so you can start exactly where you are.",
  },
  {
    question: "Can I get a certificate after completing a course?",
    answer:
      "Yes — certificates are generated automatically once you complete all lessons, assignments, and the final quiz for a course.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "The web platform is fully responsive. A dedicated mobile app is on the roadmap.",
  },
  {
    question: "What's the difference between the Free and Pro plans?",
    answer:
      "Free gives you three courses to try the platform. Pro unlocks the full library, certificates, and direct teacher chat.",
  },
  {
    question: "Can teachers create their own courses?",
    answer:
      "Yes — approved teachers get a full course-creation workflow: modules, lessons, quizzes, assignments, and resources.",
  },
];

import "dotenv/config";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";
import Category from "../models/Category.js";

const CATEGORY_NAMES = ["Web Development", "Design", "Data Science", "DevOps"];

const SAMPLE_COURSES = [
  {
    title: "Full-Stack Web Development with the MERN Stack",
    slug: "full-stack-mern",
    description:
      "Build and ship real full-stack applications with MongoDB, Express, React, and Node.js — from your first route to a deployed app.",
    objectives: [
      "Build REST APIs with Express and MongoDB",
      "Build interactive UIs with React",
      "Ship a deployed full-stack app",
    ],
    requirements: ["Basic JavaScript"],
    category: "Web Development",
    tags: ["mern", "react", "node"],
    difficulty: "intermediate",
    price: 49,
    status: "published",
    modules: [
      {
        title: "Getting Started",
        order: 1,
        lessons: [
          { title: "Course overview", order: 1, durationSec: 300, isPreview: true },
          { title: "Setting up your environment", order: 2, durationSec: 480 },
        ],
      },
      {
        title: "Building the API",
        order: 2,
        lessons: [
          { title: "Express fundamentals", order: 1, durationSec: 720 },
          { title: "Connecting MongoDB", order: 2, durationSec: 640 },
        ],
      },
    ],
  },
  {
    title: "Modern UI/UX Design Systems",
    slug: "modern-ui-ux-design-systems",
    description:
      "Learn how professional product teams design and maintain scalable design systems — tokens, components, and the process behind them.",
    objectives: ["Design a token-based system", "Build a component library"],
    requirements: [],
    category: "Design",
    tags: ["design", "ui", "ux"],
    difficulty: "beginner",
    price: 39,
    status: "published",
    modules: [
      {
        title: "Foundations",
        order: 1,
        lessons: [
          { title: "What is a design system?", order: 1, durationSec: 360, isPreview: true },
          { title: "Color and typography tokens", order: 2, durationSec: 540 },
        ],
      },
    ],
  },
];

async function seedCourses() {
  await mongoose.connect(env.mongoUri);
  console.log(`[seed:courses] connected → ${mongoose.connection.name}`);

  for (const name of CATEGORY_NAMES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await Category.findOneAndUpdate(
      { slug },
      { name, slug },
      { upsert: true, new: true }
    );
  }
  console.log(`[seed:courses] categories ready: ${CATEGORY_NAMES.join(", ")}`);

  let instructor = await User.findOne({ role: "teacher" });
  if (!instructor) {
    instructor = await User.create({
      name: "Amara Chen",
      email: "amara.chen@example.com",
      password: "TeacherDemo123!",
      role: "teacher",
      isEmailVerified: true,
      teacherProfile: { approved: true, bio: "Senior Full-Stack Engineer", expertise: ["MERN"] },
    });
    console.log(`[seed:courses] created demo teacher: ${instructor.email} / TeacherDemo123!`);
  }

  for (const data of SAMPLE_COURSES) {
    const existing = await Course.findOne({ slug: data.slug });
    if (existing) {
      console.log(`[seed:courses] "${data.title}" already exists — skipping.`);
      continue;
    }

    const course = await Course.create({ ...data, instructor: instructor._id });
    console.log(`[seed:courses] created "${course.title}"`);

    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      await Assignment.create({
        course: course._id,
        teacher: instructor._id,
        title: `${course.title.split(" ").slice(0, 3).join(" ")} — First Project`,
        description: "Submit a link to your work (GitHub repo, deployed link, or doc).",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxScore: 100,
      });

      await Quiz.create({
        course: course._id,
        title: `${course.title.split(" ").slice(0, 3).join(" ")} — Checkpoint Quiz`,
        timerSeconds: 300,
        questions: [
          {
            type: "mcq",
            text: "Which of these is NOT part of the MERN stack?",
            options: ["MongoDB", "Express", "Django", "Node.js"],
            correctAnswer: "Django",
            points: 1,
          },
          {
            type: "truefalse",
            text: "React is a backend framework.",
            options: ["True", "False"],
            correctAnswer: "False",
            points: 1,
          },
        ],
      });
    }
  }

  await mongoose.disconnect();
  console.log("[seed:courses] done.");
  process.exit(0);
}

seedCourses().catch((err) => {
  console.error("[seed:courses] failed:", err);
  process.exit(1);
});

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    avatarInitials: { type: String, default: '' },
    streak: { type: Number, default: 0 },
    totalHoursLearned: { type: Number, default: 0 },
    certificatesEarned: { type: Number, default: 0 },
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0 },
        completedLessons: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

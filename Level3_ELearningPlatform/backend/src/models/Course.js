import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String, enum: ['video', 'quiz', 'assignment'], default: 'video' },
  videoUrl: { type: String },
  content: { type: String },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    instructorName: { type: String }, // denormalized for fast reads
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    duration: { type: String },
    price: { type: Number, default: 0 },
    thumbnail: { type: String },
    rating: { type: Number, default: 0 },
    studentsEnrolled: { type: Number, default: 0 },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);

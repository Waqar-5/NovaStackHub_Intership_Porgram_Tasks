import mongoose from "mongoose";

const { Schema } = mongoose;

const quizAttemptSchema = new Schema(
  {
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        answer: { type: String, required: true },
        correct: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    autoSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);

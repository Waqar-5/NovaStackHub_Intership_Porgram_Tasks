import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    type: { type: String, enum: ["mcq", "truefalse", "short"], required: true },
    text: { type: String, required: true },
    options: { type: [String], default: [] }, // used for mcq/truefalse
    correctAnswer: { type: String, required: true }, // never sent to students — see quizController
    points: { type: Number, default: 1, min: 1 },
  },
  { _id: true }
);

const quizSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    timerSeconds: { type: Number, required: true, min: 30 },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

quizSchema.virtual("totalPoints").get(function totalPoints() {
  return this.questions.reduce((sum, q) => sum + q.points, 0);
});
quizSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Quiz", quizSchema);

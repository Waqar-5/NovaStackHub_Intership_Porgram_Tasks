import mongoose from "mongoose";

const { Schema } = mongoose;

const assignmentSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    attachmentUrl: { type: String, default: "" },
    deadline: { type: Date, required: true },
    maxScore: { type: Number, default: 100, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);

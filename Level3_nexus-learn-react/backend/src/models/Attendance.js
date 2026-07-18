import mongoose from "mongoose";

const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      required: true,
    },
    markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);

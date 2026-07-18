import mongoose from "mongoose";

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },

    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    // Lesson subdocuments are embedded in Course, so we track completion by
    // their auto-generated ObjectIds rather than a separate join collection.
    completedLessonIds: { type: [Schema.Types.ObjectId], default: [] },

    status: {
      type: String,
      enum: ["active", "completed", "refunded"],
      default: "active",
    },
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Text/link submission for now — file upload wires in once Cloudinary
    // credentials are configured; the field name stays the same either way.
    fileUrl: { type: String, required: true },
    note: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "graded", "resubmit"],
      default: "pending",
    },
    score: { type: Number, default: null },
    feedback: { type: String, default: "" },
    gradedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    gradedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const certificateSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    certificateId: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
    // PDF rendering is deferred — see services/certificateService.js. The
    // record (and its verifiable certificateId) exists as soon as a course
    // hits 100%, independent of whether a PDF has been generated yet.
    pdfUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Certificate", certificateSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const announcementSchema = new Schema(
  {
    scope: { type: String, enum: ["global", "course"], required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", default: null },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);

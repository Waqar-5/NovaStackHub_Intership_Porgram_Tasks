import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    type: { type: String, enum: ["pdf", "image", "video", "link"], required: true },
    url: { type: String, required: true },
    fileName: { type: String, default: "" },
  },
  { _id: false }
);

const lessonSchema = new Schema({
  title: { type: String, required: true, trim: true },
  order: { type: Number, required: true },
  videoUrl: { type: String, default: "" },
  durationSec: { type: Number, default: 0 },
  content: { type: String, default: "" }, // markdown/text for non-video lessons
  resources: { type: [resourceSchema], default: [] },
  isPreview: { type: Boolean, default: false },
});

const moduleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  order: { type: Number, required: true },
  lessons: { type: [lessonSchema], default: [] },
});

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    objectives: { type: [String], default: [] },
    requirements: { type: [String], default: [] },

    thumbnailUrl: { type: String, default: "" },
    trailerUrl: { type: String, default: "" },

    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },

    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },

    price: { type: Number, required: true, min: 0, default: 0 },
    discountPrice: { type: Number, default: null },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },

    modules: { type: [moduleSchema], default: [] },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text", tags: "text" });

// Convenience virtuals — computed on read, never stored, so they can't drift.
courseSchema.virtual("lessonCount").get(function lessonCount() {
  return this.modules.reduce((sum, m) => sum + m.lessons.length, 0);
});
courseSchema.virtual("durationSec").get(function totalDuration() {
  return this.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + (l.durationSec || 0), 0),
    0
  );
});
courseSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Course", courseSchema);

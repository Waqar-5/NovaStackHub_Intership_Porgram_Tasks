import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    avatarUrl: { type: String, default: "" },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Hashed refresh tokens (rotation-friendly: a user can be logged in on
    // multiple devices, each with its own token; compromised ones can be
    // revoked individually without logging every session out).
    refreshTokens: { type: [String], default: [], select: false },

    lastLoginAt: { type: Date },

    studentProfile: {
      bio: { type: String, default: "" },
      phone: { type: String, default: "" },
      wishlist: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      bookmarks: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    },
    teacherProfile: {
      bio: { type: String, default: "" },
      expertise: { type: [String], default: [] },
      approved: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never leak sensitive fields even if a route accidentally sends the raw doc.
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.emailVerifyToken;
    delete ret.resetPasswordToken;
    return ret;
  },
});

export default mongoose.model("User", userSchema);

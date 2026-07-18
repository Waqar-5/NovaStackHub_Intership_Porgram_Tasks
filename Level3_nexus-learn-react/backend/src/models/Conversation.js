import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageText: { type: String, default: "" },
  },
  { timestamps: true }
);

// A 1:1 conversation between the same two people should never be duplicated.
conversationSchema.index({ participants: 1 });

export default mongoose.model("Conversation", conversationSchema);

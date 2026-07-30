import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ contentId: 1 });
commentSchema.index({ createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
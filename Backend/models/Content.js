import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "paragraph",
        "heading",
        "image",
        "quote",
        "list",
      ],
    },

    value: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["article", "archive", "interview"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    thumbnailURL: {
      type: String,
      default: "",
    },

    // For articles + archives
    content: {
      type: [contentBlockSchema],
      default: [],
    },

    // For interviews
    description: {
      type: String,
      default: "",
    },

    videoURL: {
      type: String,
      default: "",
    },

    videoPublicId: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    guests: [
      {
        type: String,
      },
    ],

    historicalDate: {
      type: Date,
    },

    category: {
      type: String,
      default: "general",
    },

    tags: [
      {
        type: String,
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ type: 1 });
contentSchema.index({ category: 1 });
contentSchema.index({ publishedAt: -1 });
contentSchema.index({ tags: 1 });

contentSchema.index({
  title: "text",
  subtitle: "text",
});

export default mongoose.model("Content", contentSchema);
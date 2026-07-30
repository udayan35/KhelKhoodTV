import express from "express";
import Comment from "../models/comment.js";
import Content from "../models/Content.js";
import protect from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Get comments for a content item
router.get("/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;
    const comments = await Comment.find({ contentId }).sort({ createdAt: -1 });
    return res.json({ comments, success: true });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Error fetching comments", success: false });
  }
});

// Create a comment
router.post("/", protect, async (req, res) => {
  try {
    const { contentId, text, userName, email } = req.body;

    if (!contentId || !text) {
      return res.status(400).json({ message: "contentId and text are required", success: false });
    }

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found", success: false });
    }

    const comment = new Comment({
      contentId,
      userId: req.user._id,
      userName: userName || req.user.name,
      email: email || req.user.email,
      text,
    });

    await comment.save();

    return res.status(201).json({ comment, success: true });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Error creating comment", success: false });
  }
});

export default router;
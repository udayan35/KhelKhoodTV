import express from "express";
import Content from "../models/Content.js";
import Comment from "../models/comment.js";
import slugify from "slugify";
import protect from "../Middlewares/authMiddleware.js";

const router = express.Router();

//Content Routes
router.get("/", async (req, res) => {
  try {
    const type = req.query.type;
    const filter = {};
    if (type) filter.type = type;
    const recs = await Content.find(filter);
    return res.json({
      data: recs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({
      message: "Error fetching articles",
      success: false,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title || "", { lower: true, strict: true });
    req.body.authorId = req.user._id;
    req.body.publishedAt = new Date();
    req.body.status = "published";

    if (req.body.type === "interview") {
      req.body.content = [];
    } else if (!req.body.content) {
      req.body.content = [{ type: "paragraph", value: req.body.contentText || "" }];
    }

    if (!req.body.slug) {
      return res.status(400).json({
        message: "Title is required to create content.",
        success: false,
      });
    }

    const newContent = new Content(req.body);
    await newContent.save();

    return res.json({
      message: "Content added successfully",
      success: true,
      content: newContent,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    return res.status(500).json({
      message: error.name === "ValidationError" ? error.message : "Error creating content",
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Content.findByIdAndDelete(id);
    await Comment.deleteMany({ contentId: id });

    return res.json({
      message: "Content deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    return res.status(500).json({
      message: "Error deleting content",
      success: false,
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Content.findOne({ slug });
    if (!article) return res.status(404).json({ message: "Not found", success: false });
    const comments = await Comment.find({ contentId: article._id }).sort({ createdAt: -1 });

    return res.json({
      article,
      comments,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({
      message: "Error fetching articles",
      success: false,
    });
  }
});

export default router;
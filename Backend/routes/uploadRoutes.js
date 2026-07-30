import express from "express";
import fs from "fs/promises";
import { imageUpload, videoUpload } from "../Middlewares/upload.js";
import cloudinary from "../Config/cloudinary.js";

const router = express.Router();

const removeTempFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Failed to remove temp upload file:", error.message);
    }
  }
};

router.post("/image", (req, res, next) => {
  imageUpload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload route error:", err);
      return res.status(400).json({ error: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    res.json({ imageUrl: req.file.path });
  });
});

router.post("/interview", (req, res, next) => {
  videoUpload.single("video")(req, res, async (err) => {
    if (err) {
      console.error("Upload route error:", err);
      return res.status(400).json({ error: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    try {
      const isLargeVideo = req.file.size > 100 * 1024 * 1024;
      const uploadMethod = isLargeVideo ? "upload_large" : "upload";

      const uploadResult = await cloudinary.uploader[uploadMethod](req.file.path, {
        resource_type: "video",
        folder: "news-website",
      });

      const videoUrl = uploadResult.secure_url || uploadResult.url || "";

      if (!videoUrl) {
        return res.status(500).json({ error: "Cloudinary did not return a video URL" });
      }

      return res.json({
        videoUrl,
        publicId: uploadResult.public_id,
        duration: uploadResult.duration,
      });
    } catch (uploadError) {
      console.error("Cloudinary large video upload failed:", uploadError);
      return res.status(500).json({ error: uploadError.message || "Video upload failed" });
    } finally {
      await removeTempFile(req.file.path);
    }
  });
});

export default router;
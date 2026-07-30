import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoTempDir = path.resolve(__dirname, "../tmp/uploads");

if (!fs.existsSync(videoTempDir)) {
  fs.mkdirSync(videoTempDir, { recursive: true });
}

const createUpload = (resourceType, allowedFormats) =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "news-website",
        resource_type: resourceType,
        allowed_formats: allowedFormats,
      },
    }),
  });

const imageUpload = createUpload("image", ["jpg", "jpeg", "png", "webp"]);

const videoUpload = multer({
  dest: videoTempDir,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

export { imageUpload, videoUpload };
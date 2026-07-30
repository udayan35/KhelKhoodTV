import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import ContentRoutes from "./routes/ContentRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import connectDB from "./Config/db.js";
import "./Config/cloudinary.js";

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if(process.env.NODE_ENV !== "production") {
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy blocked this origin"));
      }
    },
  })
)};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/content", ContentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

// Serve React
console.log("__dirname =", __dirname);
console.log("cwd =", process.cwd());

app.use(express.static(path.join(__dirname, "public")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
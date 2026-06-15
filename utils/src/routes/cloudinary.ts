import express from "express";
import cloudinary from "cloudinary";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { buffer } = req.body;

    if (!buffer) {
      return res.status(400).json({
        message: "Image buffer is required",
      });
    }

    const cloud = await cloudinary.v2.uploader.upload(buffer, {
      resource_type: "auto",
      timeout: 60000,
    });

    res.json({
      url: cloud.secure_url,
    });
  } catch (error: any) {
    const status = error?.http_code || 500;
    const message =
      status === 429
        ? "Image upload limit reached. Please try again in a moment."
        : error.message || "Image upload failed";

    res.status(status).json({ message });
  }
});

export default router;
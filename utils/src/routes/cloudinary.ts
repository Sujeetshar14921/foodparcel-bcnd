import express from "express";
import cloudinary from "cloudinary";

const router = express.Router();

// ✅ Cloudinary config (IMPORTANT)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

router.post("/upload", async (req, res) => {
  try {
    const { buffer } = req.body;

    if (!buffer) {
      return res.status(400).json({
        message: "Image buffer is required",
      });
    }

    // 🔥 FIX: convert to proper base64 format
    const result = await cloudinary.v2.uploader.upload(
      `data:image/png;base64,${buffer}`,
      {
        resource_type: "auto",
        timeout: 60000,
      }
    );

    return res.json({
      url: result.secure_url,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    const status = error?.http_code || 500;

    const message =
      status === 429
        ? "Too many upload requests. Please wait a moment."
        : error.message || "Image upload failed";

    return res.status(status).json({ message });
  }
});

export default router;

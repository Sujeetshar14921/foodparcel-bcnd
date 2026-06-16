import express from "express";
import cloudinary from "cloudinary";

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

router.post("/upload", async (req, res) => {
  try {
    let { buffer } = req.body;

    if (!buffer) {
      return res.status(400).json({ message: "Image buffer is required" });
    }

    // 🔥 FIX: remove duplicate data prefix if exists
    if (buffer.startsWith("data:")) {
      buffer = buffer.split(",")[1];
    }

    const result = await cloudinary.v2.uploader.upload(
      `data:image/jpeg;base64,${buffer}`,
      {
        resource_type: "auto",
        timeout: 60000,
      }
    );

    return res.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      message: error?.message || "Image upload failed",
    });
  }
});

export default router;

import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use("/api/v1", adminRoutes);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Admin Service is running on port ${port}`);
});

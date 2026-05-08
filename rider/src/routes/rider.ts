import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  acceptOrder,
  addRiderProfile,
  fetchDashboardSummary,
  fetchOrderDetails,
  fetchMyCurrentOrder,
  fetchMyProfile,
  rejectOrder,
  toggleRiderAvailablity,
  updateOrderStatus,
} from "../controllers/rider.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile, addRiderProfile);

router.get("/myprofile", isAuth, fetchMyProfile);
router.patch("/toggle", isAuth, toggleRiderAvailablity);
router.post("/accept/:orderId", isAuth, acceptOrder);
router.post("/reject/:orderId", isAuth, rejectOrder);
router.get("/order/current", isAuth, fetchMyCurrentOrder);
router.put("/order/update/:orderId", isAuth, updateOrderStatus);
router.get("/order/:orderId", isAuth, fetchOrderDetails);
router.get("/dashboard", isAuth, fetchDashboardSummary);

export default router;

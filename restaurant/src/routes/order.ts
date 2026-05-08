import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import {
  assignRiderToOrder,
  createOrder,
  fetchOrderForPayment,
  fetchRestaurantOrders,
  fetchSingleOrder,
  getRiderHistory,
  getRiderOrderById,
  getCurrentOrderForRider,
  getMyOrders,
  updateOrderStatus,
  updateOrderStatusRider,
} from "../controllers/order.js";

const router = express.Router();

router.get("/myorder", isAuth, getMyOrders);
router.get("/:id", isAuth, fetchSingleOrder);
router.post("/new", isAuth, createOrder);
router.get("/payment/:id", fetchOrderForPayment);
router.get(
  "/restaurant/:restaurantId",
  isAuth,
  isSeller,
  fetchRestaurantOrders
);
router.put("/:orderId", isAuth, isSeller, updateOrderStatus);
router.put("/assign/rider", assignRiderToOrder);
router.get("/current/rider", getCurrentOrderForRider);
router.put("/update/status/rider", updateOrderStatusRider);
router.get("/rider/history", getRiderHistory);
router.get("/rider/:id", getRiderOrderById);

export default router;

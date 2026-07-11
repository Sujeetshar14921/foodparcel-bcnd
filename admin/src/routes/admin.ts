import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  createComplaint,
  deleteRestaurant,
  deleteRider,
  getAllRestaurants,
  getAllRiders,
  getAllUsers,
  getComplaints,
  getDashboardStats,
  getPendingRestaurant,
  getPendingRiders,
  resolveComplaint,
  toggleRestaurantBlock,
  toggleRiderBlock,
  toggleUserStatus,
  verifyRestaurant,
  verifyRider,
  updateUserRole,
} from "../controllers/admin.js";

const router = express.Router();

router.get("/admin/restaurant/pending", isAuth, isAdmin, getPendingRestaurant);
router.get("/admin/rider/pending", isAuth, isAdmin, getPendingRiders);
router.patch("/verify/rider/:id", isAuth, isAdmin, verifyRider);
router.patch("/verify/restaurant/:id", isAuth, isAdmin, verifyRestaurant);
router.get("/admin/dashboard/stats", isAuth, isAdmin, getDashboardStats);

router.get("/admin/restaurants", isAuth, isAdmin, getAllRestaurants);
router.put("/admin/restaurant/block/:id", isAuth, isAdmin, toggleRestaurantBlock);
router.delete("/admin/restaurant/delete/:id", isAuth, isAdmin, deleteRestaurant);

router.get("/admin/riders", isAuth, isAdmin, getAllRiders);
router.put("/admin/rider/block/:id", isAuth, isAdmin, toggleRiderBlock);
router.delete("/admin/rider/delete/:id", isAuth, isAdmin, deleteRider);

router.get("/admin/users", isAuth, isAdmin, getAllUsers);
router.put("/admin/user/status/:id", isAuth, isAdmin, toggleUserStatus);
router.put("/admin/user/role/:id", isAuth, isAdmin, updateUserRole);

router.post("/complaint", isAuth, createComplaint);
router.get("/admin/complaints", isAuth, isAdmin, getComplaints);
router.put("/admin/complaint/resolve/:id", isAuth, isAdmin, resolveComplaint);

export default router;

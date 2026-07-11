import { ObjectId } from "mongodb";
import TryCatch from "../middlewares/trycatch.js";
import {
  getComplaintCollection,
  getRestaurantCollection,
  getRiderCollection,
  getUserCollection,
} from "../util/collection.js";

export const getPendingRestaurant = TryCatch(async (req, res) => {
  const restaurants = await (await getRestaurantCollection())
    .find({ isVerified: false })
    .toArray();

  res.json({
    count: restaurants.length,
    restaurants,
  });
});

export const getPendingRiders = TryCatch(async (req, res) => {
  const riders = await (await getRiderCollection())
    .find({ isVerified: false })
    .toArray();

  res.json({
    count: riders.length,
    riders,
  });
});

export const verifyRestaurant = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "invalid restaurant id",
    });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const result = await (
    await getRestaurantCollection()
  ).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isVerified: true,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "Restaurant not found",
    });
  }

  res.json({
    message: "Restaurant verified successfully",
  });
});

export const verifyRider = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const result = await (
    await getRiderCollection()
  ).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isVerified: true,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "rider not found",
    });
  }

  res.json({
    message: "rider verified successfully",
  });
});

export const getDashboardStats = TryCatch(async (req, res) => {
  const userCollection = await getUserCollection();
  const riderCollection = await getRiderCollection();
  const restaurantCollection = await getRestaurantCollection();
  const complaintCollection = await getComplaintCollection();

  const [
    totalUsers,
    totalCustomers,
    totalSellers,
    totalRiders,
    totalRestaurants,
    blockedRestaurants,
    pendingRestaurants,
    pendingRiders,
    totalComplaints,
    pendingComplaints,
  ] = await Promise.all([
    userCollection.countDocuments({}),
    userCollection.countDocuments({ role: "customer" }),
    userCollection.countDocuments({ role: "seller" }),
    riderCollection.countDocuments({}),
    restaurantCollection.countDocuments({}),
    restaurantCollection.countDocuments({ isBlocked: true }),
    restaurantCollection.countDocuments({ isVerified: false }),
    riderCollection.countDocuments({ isVerified: false }),
    complaintCollection.countDocuments({}),
    complaintCollection.countDocuments({ status: { $ne: "resolved" } }),
  ]);

  res.json({
    stats: {
      totalUsers,
      totalCustomers,
      totalSellers,
      totalRiders,
      totalRestaurants,
      blockedRestaurants,
      pendingRestaurants,
      pendingRiders,
      totalComplaints,
      pendingComplaints,
    },
  });
});

export const getAllRestaurants = TryCatch(async (req, res) => {
  const restaurants = await (await getRestaurantCollection())
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  res.json({
    count: restaurants.length,
    restaurants,
  });
});

export const toggleRestaurantBlock = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { blocked } = req.body as { blocked?: boolean };

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const nextBlocked = blocked ?? true;

  const result = await (await getRestaurantCollection()).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isBlocked: nextBlocked,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "Restaurant not found",
    });
  }

  res.json({
    message: nextBlocked
      ? "Restaurant blocked successfully"
      : "Restaurant unblocked successfully",
  });
});

export const deleteRestaurant = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const result = await (await getRestaurantCollection()).deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "Restaurant not found",
    });
  }

  res.json({
    message: "Restaurant deleted successfully",
  });
});

export const getAllRiders = TryCatch(async (req, res) => {
  const riderCollection = await getRiderCollection();
  const userCollection = await getUserCollection();

  const riders = await riderCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const ridersWithUser = await Promise.all(
    riders.map(async (rider) => {
      const riderUserId = rider.userId;

      if (!riderUserId || !ObjectId.isValid(riderUserId)) {
        return {
          ...rider,
          name: "Unknown Rider",
          email: "",
          image: rider.picture,
        };
      }

      const riderUser = await userCollection.findOne(
        { _id: new ObjectId(riderUserId) },
        {
          projection: {
            name: 1,
            email: 1,
            image: 1,
          },
        }
      );

      return {
        ...rider,
        name: riderUser?.name ?? "Unknown Rider",
        email: riderUser?.email ?? "",
        image: riderUser?.image ?? rider.picture,
      };
    })
  );

  res.json({
    count: ridersWithUser.length,
    riders: ridersWithUser,
  });
});

export const toggleRiderBlock = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { blocked } = req.body as { blocked?: boolean };

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const nextBlocked = blocked ?? true;

  const result = await (await getRiderCollection()).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isBlocked: nextBlocked,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "Rider not found",
    });
  }

  res.json({
    message: nextBlocked
      ? "Rider blocked successfully"
      : "Rider unblocked successfully",
  });
});

export const deleteRider = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const result = await (await getRiderCollection()).deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "Rider not found",
    });
  }

  res.json({
    message: "Rider deleted successfully",
  });
});

export const getAllUsers = TryCatch(async (req, res) => {
  const role = req.query.role;
  const filter = typeof role === "string" && role ? { role } : {};

  const users = await (await getUserCollection())
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  res.json({
    count: users.length,
    users,
  });
});

export const toggleUserStatus = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { active } = req.body as { active?: boolean };

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const result = await (await getUserCollection()).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        active: active ?? false,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    message: active ?? false
      ? "User activated successfully"
      : "User deactivated successfully",
  });
});

export const updateUserRole = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body as { role?: string };

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  if (!role || typeof role !== "string") {
    return res.status(400).json({
      message: "Role is required",
    });
  }

  const result = await (await getUserCollection()).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    message: "User role updated successfully",
  });
});

export const createComplaint = TryCatch(async (req, res) => {
  const { title, message, userType } = req.body as {
    title?: string;
    message?: string;
    userType?: string;
  };

  if (!message) {
    return res.status(400).json({
      message: "Message is required",
    });
  }

  const user = req.user as any;

  const complaint = {
    title: title || "Complaint",
    message,
    userType: userType || user?.role || "customer",
    userId: user?._id ?? null,
    userName: user?.name ?? "",
    userEmail: user?.email ?? "",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await (await getComplaintCollection()).insertOne(complaint);

  res.status(201).json({
    complaint: {
      ...complaint,
      _id: result.insertedId.toString(),
    },
  });
});

export const getComplaints = TryCatch(async (req, res) => {
  const userType = req.query.userType;
  const filter =
    typeof userType === "string" && userType !== "all"
      ? { userType }
      : {};

  const complaints = await (await getComplaintCollection())
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  res.json({
    count: complaints.length,
    complaints,
  });
});

export const resolveComplaint = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid object id",
    });
  }

  const result = await (await getComplaintCollection()).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "resolved",
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "Complaint not found",
    });
  }

  res.json({
    message: "Complaint resolved successfully",
  });
});

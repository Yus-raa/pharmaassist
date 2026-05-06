import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import User from "../models/user.js";

// GET ALL USERS (Admin)
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const skip = (page - 1) * limit;

  // Count total users (excluding admins if needed)
  const totalUsers = await User.countDocuments({ role: "user" });

  // Fetch users
  const users = await User.find({ role: "user" })
    .sort({ createdAt: -1 }) // latest first
    .skip(skip)
    .limit(limit)
    .select("-password"); // never send passwords

  res.status(200).json({
    success: true,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});
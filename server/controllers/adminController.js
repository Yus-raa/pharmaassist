import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import User from "../models/user.js";
import Order from "../models/orders.js";
import Product from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";

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

// DELETE USER (Admin)
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // delete avatar from cloudinary
  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// DASHBOARD STATS (Admin)
export const dashboardStats = catchAsyncError(async (req, res, next) => {
  const now = new Date();

  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const endOfToday = new Date(now.setHours(23, 59, 59, 999));

  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const lastMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  );

  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  // TOTAL REVENUE
  const totalRevenueAgg = await Order.aggregate([
    { $match: { paid_at: { $ne: null } } },
    { $group: { _id: null, total: { $sum: "$total_price" } } },
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;

  // TODAY REVENUE
  const todayRevenueAgg = await Order.aggregate([
    {
      $match: {
        paid_at: { $ne: null },
        createdAt: { $gte: startOfToday, $lte: endOfToday },
      },
    },
    { $group: { _id: null, total: { $sum: "$total_price" } } },
  ]);

  const todayRevenue = todayRevenueAgg[0]?.total || 0;

  const yesterdayAgg = await Order.aggregate([
    {
      $match: {
        paid_at: { $ne: null },
        createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
      },
    },
    { $group: { _id: null, total: { $sum: "$total_price" } } },
  ]);

const yesterdayRevenue = yesterdayAgg[0]?.total || 0;

  // USERS
  const totalUsers = await User.countDocuments({ role: "User" });

  // ORDER STATUS
  const statusAgg = await Order.aggregate([
    { $match: { paid_at: { $ne: null } } },
    {
      $group: {
        _id: "$order_status",
        count: { $sum: 1 },
      },
    },
  ]);

 const orderStatusCounts = {
  Processing: 0,
  Shipped: 0,
  Delivered: 0,
  Cancelled: 0,
};

statusAgg.forEach((s) => {
  orderStatusCounts[s._id] = s.count;
});

  // MONTHLY SALES
  const monthlySales = await Order.aggregate([
    { $match: { paid_at: { $ne: null } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total: { $sum: "$total_price" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // TOP SELLING PRODUCTS
  const topProducts = await Order.aggregate([
    { $match: { paid_at: { $ne: null } } },
    { $unwind: "$order_items" },
    {
      $group: {
        _id: "$order_items.product_id",
        name: { $first: "$order_items.name" },
        totalSold: { $sum: "$order_items.quantity" },
        revenue: {
          $sum: {
            $multiply: [
              "$order_items.price",
              "$order_items.quantity",
            ],
          },
        },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // LOW STOCK
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .select("name stock")
    .limit(10);

  // CURRENT VS LAST MONTH
  const currentMonthAgg = await Order.aggregate([
    {
      $match: {
        paid_at: { $ne: null },
        createdAt: { $gte: currentMonthStart },
      },
    },
    { $group: { _id: null, total: { $sum: "$total_price" } } },
  ]);

  const lastMonthAgg = await Order.aggregate([
    {
      $match: {
        paid_at: { $ne: null },
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      },
    },
    { $group: { _id: null, total: { $sum: "$total_price" } } },
  ]);

  const currentMonthSales = currentMonthAgg[0]?.total || 0;
  const lastMonthSales = lastMonthAgg[0]?.total || 0;

  let growth = 0;
  if (lastMonthSales > 0) {
    growth = ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
  }

  // NEW USERS
  const newUsers = await User.countDocuments({
    createdAt: { $gte: currentMonthStart },
    role: "User",
  });

  // FINAL RESPONSE
  res.status(200).json({
    success: true,
    totalRevenue,
    todayRevenue,
    yesterdayRevenue,
    totalUsers,
    newUsers,
    orderStatusCounts,
    monthlySales,
    topProducts,
    lowStockProducts,
    currentMonthSales,
    growth: `${growth.toFixed(2)}%`,
  });
});
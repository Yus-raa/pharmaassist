import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
} from "lucide-react";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    orderStatusCounts,
    topSellingProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
    currentMonthSales,
  } = useSelector((state) => state.admin);

  // TOTAL ORDERS
  const totalOrders = useMemo(() => {
    return Object.values(orderStatusCounts || {}).reduce(
      (acc, count) => acc + Number(count || 0),
      0
    );
  }, [orderStatusCounts]);

  // BEST SELLER
  const bestSeller =
    topSellingProducts?.[0];

  // REVENUE TREND
  const growthValue =
    revenueGrowth || "0%";

  const isPositiveGrowth =
    !growthValue.includes("-");

  // SUMMARY DATA
  const summary = [
    {
      title: "Monthly Revenue",
      description: `PKR ${formatNumber(
        currentMonthSales || 0
      )} earned this month`,
      icon: Wallet,
      color:
        "from-emerald-500 to-cyan-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

    {
      title: "Orders Processed",
      description: `${formatNumber(
        totalOrders
      )} customer orders placed`,
      icon: PackageCheck,
      color:
        "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Best Selling Medicine",
      description: bestSeller
        ? `${bestSeller.name} • ${formatNumber(
            bestSeller.totalSold || 0
          )} sold`
        : "No sales recorded yet",
      icon: TrendingUp,
      color:
        "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Low Stock Alerts",
      description: `${
        lowStockProducts?.length || 0
      } medicines need restocking`,
      icon: AlertTriangle,
      color:
        "from-orange-500 to-red-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Revenue Growth",
      description: `Revenue ${
        isPositiveGrowth
          ? "increased"
          : "decreased"
      } by ${growthValue}`,
      icon: BarChart4,
      color:
        "from-cyan-500 to-sky-500",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },

    {
      title: "New Customers",
      description: `${formatNumber(
        newUsersThisMonth || 0
      )} new users joined this month`,
      icon: UserPlus,
      color:
        "from-teal-500 to-emerald-500",
      bg: "bg-teal-50",
      border: "border-teal-100",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-cyan-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Monthly Summary
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Overview of important pharmacy
            business metrics and healthcare
            sales performance.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-emerald-100 px-5 py-3 shadow-sm">
          <p className="text-xs text-slate-500">
            PharmaAssist Insights
          </p>

          <h3 className="text-lg font-bold text-emerald-600">
            Dashboard Summary
          </h3>
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {summary.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl border ${item.border} ${item.bg} p-5 hover:shadow-md transition-all duration-300`}
              >
                {/* TOP GRADIENT */}
                <div
                  className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${item.color}`}
                />

                {/* ICON */}
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-sm`}
                >
                  <Icon
                    className={`w-7 h-7 ${item.iconColor}`}
                  />
                </div>

                {/* CONTENT */}
                <div className="mt-5">
                  <h3 className="text-lg font-bold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* GLOW EFFECT */}
                <div
                  className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-r ${item.color} opacity-10 blur-2xl`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MiniSummary;
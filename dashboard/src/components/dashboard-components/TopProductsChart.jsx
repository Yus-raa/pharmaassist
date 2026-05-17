import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Pill,
  TrendingUp,
  PackageCheck,
  DollarSign,
} from "lucide-react";
import { formatNumber } from "../../lib/helper";

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector(
    (state) => state.admin
  );

  // TRANSFORM DATA
  const chartData = useMemo(() => {
    if (!topSellingProducts?.length) return [];

    return topSellingProducts.map((product) => ({
      name:
        product?.name?.length > 18
          ? `${product.name.slice(0, 18)}...`
          : product.name,
      fullName: product?.name,
      sold: product?.totalSold || 0,
      revenue: product?.revenue || 0,
    }));
  }, [topSellingProducts]);

  const barColors = [
    "#10B981", // emerald
    "#06B6D4", // cyan
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#14B8A6", // teal
  ];

  // CUSTOM TOOLTIP
  const CustomTooltip = ({
    active,
    payload,
  }) => {
    if (
      active &&
      payload &&
      payload.length
    ) {
      const data = payload[0].payload;

      return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {data.fullName}
              </p>

              <p className="text-xs text-slate-500">
                PharmaAssist Product
              </p>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2 text-slate-700">
              <PackageCheck className="w-4 h-4 text-cyan-600" />
              Units Sold:
              <span className="font-bold">
                {data.sold}
              </span>
            </p>

            <p className="flex items-center gap-2 text-slate-700">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Revenue:
              <span className="font-bold">
                PKR {formatNumber(data.revenue)}
              </span>
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-emerald-50 to-cyan-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Top Selling Medicines
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Most purchased healthcare products
              based on customer orders.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-emerald-100 px-4 py-2 shadow-sm">
          <p className="text-xs text-slate-500">
            Products
          </p>

          <h3 className="text-lg font-bold text-emerald-600">
            {chartData.length}
          </h3>
        </div>
      </div>

      {/* EMPTY STATE */}
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <PackageCheck className="w-10 h-10 text-emerald-600" />
          </div>

          <h3 className="text-xl font-bold text-slate-700">
            No Product Sales Yet
          </h3>

          <p className="text-slate-500 mt-2 max-w-md">
            Once customers start placing
            medicine orders, the best-selling
            products will appear here.
          </p>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="h-[380px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "rgba(16,185,129,0.06)",
                  }}
                />

                <Bar
                  dataKey="sold"
                  radius={[14, 14, 0, 0]}
                >
                  {chartData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          barColors[
                            index %
                              barColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER STATS */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-sm text-slate-500">
                Best Seller
              </p>

              <h3 className="font-bold text-slate-800 mt-1">
                {topSellingProducts?.[0]?.name ||
                  "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-4">
              <p className="text-sm text-slate-500">
                Total Units Sold
              </p>

              <h3 className="font-bold text-slate-800 mt-1">
                {formatNumber(
                  topSellingProducts.reduce(
                    (acc, item) =>
                      acc +
                      (item.totalSold || 0),
                    0
                  )
                )}
              </h3>
            </div>

            <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
              <p className="text-sm text-slate-500">
                Combined Revenue
              </p>

              <h3 className="font-bold text-slate-800 mt-1">
                PKR{" "}
                {formatNumber(
                  topSellingProducts.reduce(
                    (acc, item) =>
                      acc +
                      (item.revenue || 0),
                    0
                  )
                )}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProductsChart;
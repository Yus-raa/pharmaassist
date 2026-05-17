import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLastNMonths } from "../../lib/helper";
import { Activity } from "lucide-react";

const MonthlySalesChart = () => {
  const { monthlySales, loading } = useSelector((state) => state.admin);

  // Convert backend data → readable format
  const formattedBackendData = useMemo(() => {
    return (
      monthlySales?.map((item) => {
        const date = new Date(item._id.year, item._id.month - 1);
        return {
          month: date.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          }),
          totalSales: item.total,
        };
      }) || []
    );
  }, [monthlySales]);

  // last 4 months baseline
  const lastMonths = getLastNMonths(4);

  const chartData = useMemo(() => {
    return lastMonths.map((m) => {
      const found = formattedBackendData.find((d) => d.month === m.month);

      return {
        month: m.month,
        totalSales: found?.totalSales || 0,
      };
    });
  }, [formattedBackendData]);

  if (loading) {
    return (
      <div className="h-64 bg-white rounded-2xl border animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Monthly Sales
          </h3>
          <p className="text-sm text-slate-500">
            Revenue trend of PharmaAssist
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Activity className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* CHART */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />

            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
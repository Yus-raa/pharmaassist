import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const OrdersChart = () => {
  const { orderStatusCounts } = useSelector((state) => state.admin);

  const statusColors = {
    Processing: "#f59e0b", // amber (more medical UI friendly)
    Shipped: "#3b82f6", // blue
    Delivered: "#10b981", // emerald
    Cancelled: "#ef4444", // red
  };

  // safe fallback + transform
  const orderStatusData = Object.entries(orderStatusCounts || {}).map(
    ([status, count]) => ({
      status,
      count: Number(count) || 0,
    })
  );

  const isEmpty = orderStatusData.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-emerald-50 p-5">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Order Status Overview
        </h3>
        <p className="text-sm text-slate-500">
          Distribution of pharmacy order lifecycle
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-[260px]">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            No order data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                paddingAngle={3}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusColors[entry.status] || "#94a3b8"}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;
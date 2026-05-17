import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";
import { Activity, Users, DollarSign } from "lucide-react";

const Stats = () => {
  const {
    totalRevenue,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
    loading,
  } = useSelector((state) => state.admin);

  
  const [revenueChange, setRevenueChange] = useState("0%");

  // SAFE CALCULATION
  useEffect(() => {
    if (!yesterdayRevenue) {
      setRevenueChange("+100% vs yesterday");
      return;
    }

    const change =
      ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    const sign = change >= 0 ? "+" : "";

    setRevenueChange(`${sign}${change.toFixed(2)}% vs yesterday`);
  }, [todayRevenue, yesterdayRevenue]);

  const stats = useMemo(
    () => [
      {
        title: "Today's Revenue",
        value: formatNumber(todayRevenue || 0),
        change: revenueChange,
        icon: DollarSign,
        color: "from-emerald-500 to-cyan-500",
      },
      {
        title: "Total Users",
        value: totalUsersCount || 0,
        change: "Registered users",
        icon: Users,
        color: "from-blue-500 to-indigo-500",
      },
      {
        title: "All Time Revenue",
        value: formatNumber(totalRevenue || 0),
        change: "Lifetime earnings",
        icon: Activity,
        color: "from-purple-500 to-pink-500",
      },
    ],
    [todayRevenue, totalUsersCount, totalRevenue, revenueChange]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 p-5"
          >
            {/* gradient bar */}
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>

                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                  {stat.value}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {stat.change}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
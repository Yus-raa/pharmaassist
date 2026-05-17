import React, { useEffect } from "react";
import Header from "./Header";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import MiniSummary from "./dashboard-components/MiniSummary";
import { useDispatch } from "react-redux";
import { fetchDashboardStats } from "../store/slices/adminSlice";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* PAGE WRAPPER */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">

        {/* STATS */}
        <Stats />

        {/* CHART GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlySalesChart />
          <OrdersChart />
        </div>

        {/* FULL WIDTH CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts/>
        <TopProductsChart />
        </div>

        {/* MINI SUMMARY */}
        <MiniSummary />

      </div>
    </main>
  );
};

export default Dashboard;
import React, { useEffect, useMemo, useState } from "react";

import {
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ShoppingBag,
  ArrowRight,
  Clock3,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] =
    useState("all");

  const {
    myOrders = [],
    loading,
  } = useSelector((state) => state.order);

  const { authUser } = useSelector(
    (state) => state.auth
  );

  // REDIRECT IF NOT LOGGED IN
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // FETCH ORDERS
  useEffect(() => {
    if (authUser) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, authUser]);

  // FILTERED ORDERS
  const filteredOrders = useMemo(() => {
    return myOrders.filter((order) => {
      if (statusFilter === "all")
        return true;

      return (
        order.order_status?.toLowerCase() ===
        statusFilter.toLowerCase()
      );
    });
  }, [myOrders, statusFilter]);

  // STATUS ICON
  const getStatusIcon = (status) => {
    switch (
      status?.toLowerCase()
    ) {
      case "processing":
        return (
          <Package className="text-yellow-500" />
        );

      case "shipped":
        return (
          <Truck className="text-blue-500" />
        );

      case "delivered":
        return (
          <CheckCircle className="text-green-500" />
        );

      case "cancelled":
        return (
          <XCircle className="text-red-500" />
        );

      default:
        return (
          <Clock3 className="text-gray-500" />
        );
    }
  };

  // STATUS COLORS
  const getStatusStyles = (
    status
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const statusArray = [
    "all",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8FFFE] to-[#EEF8F7]">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FFFE] to-[#EEF8F7] py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-800">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage your
            medicine orders easily.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 mb-10">

          <div className="flex items-center gap-2 text-gray-600 font-medium mr-2">
            <Filter size={18} />
            Filter by Status
          </div>

          {statusArray.map((status) => (

            <button
              key={status}
              onClick={() =>
                setStatusFilter(status)
              }

              className={`px-5 py-2 rounded-2xl border text-sm font-medium capitalize transition-all duration-300

                ${
                  statusFilter === status
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-white border-green-100 text-gray-600 hover:border-green-300 hover:text-green-600"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {/* NO ORDERS */}
        {filteredOrders.length === 0 ? (

          <div className="bg-white rounded-3xl border border-green-100 shadow-md p-10 text-center">

            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">

              <ShoppingBag
                size={40}
                className="text-green-600"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">

              {statusFilter === "all"
                ? "No Orders Found"
                : `No ${statusFilter} Orders`}
            </h2>

            <p className="text-gray-500 mb-8 max-w-md mx-auto">

              {statusFilter === "all"
                ? "You haven't placed any orders yet."
                : `You currently don't have any ${statusFilter} orders.`}
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Browse Medicines
              <ArrowRight size={18} />
            </Link>
          </div>

        ) : (

          <div className="space-y-8">

            {filteredOrders.map(
              (order) => (

                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >

                  {/* ORDER HEADER */}
                  <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-transparent">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div>

                        <h2 className="text-xl font-bold text-gray-800">

                          Order #
                          {order._id.slice(
                            -8
                          )}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">

                          Placed on{" "}

                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">

                        {/* STATUS */}
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-medium ${getStatusStyles(
                            order.order_status
                          )}`}
                        >
                          {getStatusIcon(
                            order.order_status
                          )}

                          <span>
                            {
                              order.order_status
                            }
                          </span>
                        </div>

                        {/* PRICE */}
                        <div className="bg-white rounded-2xl border border-green-100 px-5 py-3 shadow-sm">

                          <p className="text-sm text-gray-500">
                            Total
                          </p>

                          <p className="text-2xl font-bold text-green-600">
                            Rs.{" "}
                            {order.total_price?.toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="p-6">

                    <div className="space-y-5">

                      {order.order_items?.map(
                        (item, index) => (

                          <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-5 border border-green-100 rounded-2xl p-4 hover:bg-green-50/40 transition"
                          >

                            {/* IMAGE */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">

                              <img
                                src={
                                  item.image ||
                                  "/vite.svg"
                                }

                                alt={
                                  item.name
                                }

                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* INFO */}
                            <div className="flex-1">

                              <h3 className="text-lg font-semibold text-gray-800">
                                {item.name}
                              </h3>

                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">

                                <span>
                                  Quantity:{" "}
                                  <span className="font-semibold text-gray-700">
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </span>

                                <span>
                                  Price:{" "}
                                  <span className="font-semibold text-green-600">
                                    Rs.{" "}
                                    {
                                      item.price
                                    }
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-green-100">

                      <Link
                        to={`/order/${order._id}`}
                        className="px-5 py-3 rounded-2xl bg-[#F4FBFA] hover:bg-green-100 text-gray-700 hover:text-green-700 transition font-medium"
                      >
                        View Details
                      </Link>

                      <button className="px-5 py-3 rounded-2xl bg-[#F4FBFA] hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition font-medium">
                        Track Order
                      </button>

                      {order.order_status ===
                        "Delivered" && (
                        <>
                          <button className="px-5 py-3 rounded-2xl bg-[#F4FBFA] hover:bg-yellow-100 text-gray-700 hover:text-yellow-700 transition font-medium">

                            Write Review
                          </button>

                          <button className="px-5 py-3 rounded-2xl bg-[#F4FBFA] hover:bg-green-100 text-gray-700 hover:text-green-700 transition font-medium">

                            Reorder
                          </button>
                        </>
                      )}

                      {order.order_status ===
                        "Processing" && (
                        <button className="px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition font-medium">

                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
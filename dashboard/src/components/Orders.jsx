import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CreditCard,
  Eye,
  MapPin,
  Package,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import Medicine from "../assets/medicine.png"
import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";

import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.order);

  const [filterByStatus, setFilterByStatus] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
  });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const statusArray = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    if (filterByStatus === "All") return orders;

    return orders?.filter(
      (order) => order.order_status === filterByStatus
    );
  }, [orders, filterByStatus]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(
      updateOrderStatus({
        orderId,
        status: newStatus,
      })
    );
  };

  const confirmDelete = () => {
    dispatch(deleteOrder(deleteConfirm.id));

    setDeleteConfirm({
      open: false,
      id: null,
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";

      case "Processing":
        return "bg-amber-100 text-amber-700 border border-amber-200";

      case "Shipped":
        return "bg-sky-100 text-sky-700 border border-sky-200";

      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <main className="flex-1 bg-[#F7FCFC] min-h-screen">
      <Header />

      <section className="p-4 sm:p-6 lg:p-8">
        {/* top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Orders Management
            </h1>

            <p className="text-slate-500 mt-2">
              Monitor, update and manage all customer orders.
            </p>
          </div>

          {/* filter */}
          <div className="flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3 shadow-sm w-full sm:w-fit">
            <Truck className="w-5 h-5 text-teal-600" />

            <select
              value={filterByStatus}
              onChange={(e) =>
                setFilterByStatus(e.target.value)
              }
              className="bg-transparent outline-none text-slate-700 font-medium"
            >
              <option value="All">All Orders</option>

              {statusArray.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* loading */}
        {loading ? (
          <div className="w-full flex items-center justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
          </div>
        ) : filteredOrders?.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 py-20 text-center">
            <ShoppingBag className="mx-auto w-14 h-14 text-slate-300 mb-4" />

            <h2 className="text-2xl font-semibold text-slate-700">
              No Orders Found
            </h2>

            <p className="text-slate-500 mt-2">
              Orders matching your selected filter will appear
              here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders?.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden"
              >
                {/* top */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    {/* left */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                          ORDER ID
                        </span>

                        <p className="font-mono text-sm text-slate-700 break-all">
                          {order._id}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />

                          <span>
                            {new Date(
                              order.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />

                          <span>
                            {order.order_items?.length} items
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />

                          <span>
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* right */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* status */}
                      <div
                        className={`px-4 py-2 rounded-xl text-sm font-semibold w-fit ${getStatusClasses(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </div>

                      {/* update status */}
                      <div className="relative">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="appearance-none bg-[#F5FAFA] border border-teal-100 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-teal-500"
                        >
                          {statusArray.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>

                      {/* view */}
                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      {/* delete */}
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            id: order._id,
                          })
                        }
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* bottom */}
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    {/* products preview */}
                    <div className="flex flex-wrap gap-4">
                      {order.order_items
                        ?.slice(0, 3)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-[#F7FCFC] border border-teal-50 rounded-2xl p-3"
                          >
                            <img
                              src={item.image || Medicine}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />

                            <div>
                              <h3 className="font-semibold text-slate-700 line-clamp-1 max-w-[160px]">
                                {item.name}
                              </h3>

                              <p className="text-sm text-slate-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* total */}
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl px-6 py-4 shadow-lg w-fit">
                      <p className="text-sm opacity-90">
                        Total Amount
                      </p>

                      <h2 className="text-2xl font-bold mt-1">
                        Rs.{" "}
                        {Number(
                          order.total_price
                        ).toLocaleString()}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* top */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Order Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* left */}
              <div className="xl:col-span-2 space-y-6">
                {/* items */}
                <div className="bg-[#F8FCFC] border border-teal-100 rounded-3xl p-5">
                  <h3 className="text-xl font-bold text-slate-800 mb-5">
                    Ordered Medicines
                  </h3>

                  <div className="space-y-4">
                    {selectedOrder.order_items?.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100"
                        >
                          <img
                            src={item.image || Medicine}
                            alt={item.name}
                            className="w-24 h-24 rounded-2xl object-cover"
                          />

                          <div className="flex-1">
                            <h4 className="font-bold text-slate-700">
                              {item.name}
                            </h4>

                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                              <span>
                                Quantity: {item.quantity}
                              </span>

                              <span>
                                Price: Rs. {item.price}
                              </span>
                            </div>
                          </div>

                          <div className="text-lg font-bold text-teal-600">
                            Rs.{" "}
                            {item.price * item.quantity}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* right */}
              <div className="space-y-6">
                {/* shipping */}
                <div className="bg-white border border-teal-100 rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <MapPin className="w-5 h-5 text-teal-600" />

                    <h3 className="text-xl font-bold text-slate-800">
                      Shipping Info
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-slate-400">
                        Full Name
                      </p>

                      <p className="font-semibold text-slate-700">
                        {
                          selectedOrder.shipping_info
                            ?.full_name
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        Phone
                      </p>

                      <p className="font-semibold text-slate-700">
                        {
                          selectedOrder.shipping_info
                            ?.phone
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        Address
                      </p>

                      <p className="font-semibold text-slate-700 leading-relaxed">
                        {
                          selectedOrder.shipping_info
                            ?.address
                        }
                        ,{" "}
                        {
                          selectedOrder.shipping_info
                            ?.city
                        }
                        ,{" "}
                        {
                          selectedOrder.shipping_info
                            ?.state
                        }
                        ,{" "}
                        {
                          selectedOrder.shipping_info
                            ?.country
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        Pincode
                      </p>

                      <p className="font-semibold text-slate-700">
                        {
                          selectedOrder.shipping_info
                            ?.pincode
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* summary */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-3xl p-5">
                  <h3 className="text-xl font-bold mb-5">
                    Payment Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Items Total</span>

                      <span>
                        Rs.{" "}
                        {selectedOrder.total_price -
                          selectedOrder.tax_price -
                          selectedOrder.shipping_price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax</span>

                      <span>
                        Rs. {selectedOrder.tax_price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>

                      <span>
                        Rs.{" "}
                        {
                          selectedOrder.shipping_price
                        }
                      </span>
                    </div>

                    <div className="border-t border-white/20 pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>

                      <span>
                        Rs.{" "}
                        {selectedOrder.total_price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mt-5">
              Delete Order?
            </h2>

            <p className="text-slate-500 text-center mt-3">
              This action cannot be undone. The order will be
              permanently removed.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() =>
                  setDeleteConfirm({
                    open: false,
                    id: null,
                  })
                }
                className="py-3 rounded-2xl border border-slate-200 font-semibold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Orders;
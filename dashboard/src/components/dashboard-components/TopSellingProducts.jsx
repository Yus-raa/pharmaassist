import React from "react";
import { useSelector } from "react-redux";
import {
  Pill,
  PackageCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { formatNumber } from "../../lib/helper";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector(
    (state) => state.admin
  );

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-cyan-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Top Selling Medicines
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Most purchased pharmacy and healthcare
              products.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <p className="text-xs text-slate-500">
            Total Products
          </p>

          <h3 className="text-2xl font-bold text-emerald-600">
            {topSellingProducts?.length || 0}
          </h3>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!topSellingProducts ||
      topSellingProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
            <PackageCheck className="w-10 h-10 text-emerald-600" />
          </div>

          <h3 className="text-xl font-bold text-slate-700">
            No Product Sales Yet
          </h3>

          <p className="text-slate-500 mt-2 max-w-md">
            Once customers start placing medicine
            orders, the top-selling products will
            appear here.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Units Sold
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Revenue
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Performance
                  </th>
                </tr>
              </thead>

              <tbody>
                {topSellingProducts.map(
                  (product, index) => (
                    <tr
                      key={product._id || index}
                      className="border-t border-slate-100 hover:bg-emerald-50/40 transition-all"
                    >
                      {/* PRODUCT */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-100 to-cyan-100 flex items-center justify-center">
                            <Pill className="w-7 h-7 text-emerald-600" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {product.name}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              Pharmacy Product
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SOLD */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center rounded-xl bg-cyan-50 border border-cyan-100 px-3 py-2">
                          <PackageCheck className="w-4 h-4 text-cyan-600 mr-2" />

                          <span className="font-semibold text-slate-700">
                            {formatNumber(
                              product.totalSold || 0
                            )}
                          </span>
                        </div>
                      </td>

                      {/* REVENUE */}
                      <td className="px-6 py-5">
                        <span className="font-bold text-emerald-600">
                          PKR{" "}
                          {formatNumber(
                            product.revenue || 0
                          )}
                        </span>
                      </td>

                      {/* PERFORMANCE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />

                          <span className="font-medium text-slate-700">
                            Top Performer
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE + TABLET CARDS */}
          <div className="lg:hidden p-4 space-y-4">
            {topSellingProducts.map(
              (product, index) => (
                <div
                  key={product._id || index}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-100 to-cyan-100 flex items-center justify-center shrink-0">
                      <Pill className="w-7 h-7 text-emerald-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {product.name}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            Pharmacy Product
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />

                          <span className="text-sm font-medium">
                            Top
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="rounded-xl bg-white border border-cyan-100 p-3">
                          <p className="text-xs text-slate-500">
                            Units Sold
                          </p>

                          <h4 className="font-bold text-cyan-600 mt-1">
                            {formatNumber(
                              product.totalSold || 0
                            )}
                          </h4>
                        </div>

                        <div className="rounded-xl bg-white border border-emerald-100 p-3">
                          <p className="text-xs text-slate-500">
                            Revenue
                          </p>

                          <h4 className="font-bold text-emerald-600 mt-1">
                            PKR{" "}
                            {formatNumber(
                              product.revenue || 0
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopSellingProducts;
import React, { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  Package2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";

import medicine from "../assets/medicine.png";

import CreateProductModal from "../modals/CreateProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";

import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
  toggleViewProductModal,
} from "../store/slices/extraSlice";

import {
  fetchAllProducts,
  deleteProduct,
} from "../store/slices/productsSlice";

const Products = () => {
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [page, setPage] = useState(1);

  const [maxPage, setMaxPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [deleteConfirm, setDeleteConfirm] =
    useState({
      open: false,
      id: null,
    });

  const {
    isViewProductModalOpened,
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
  } = useSelector((state) => state.extra);

  const {
    loading,
    products,
    totalProducts,
  } = useSelector((state) => state.product);

  // fetch products
  useEffect(() => {
    dispatch(fetchAllProducts(page));
  }, [dispatch, page]);

  // max page
  useEffect(() => {
    const pages = Math.ceil(totalProducts / 10);

    setMaxPage(pages || 1);
  }, [totalProducts]);

  // prevent invalid pages
  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  // search filter
  const filteredProducts = useMemo(() => {
    return products?.filter(
      (product) =>
        product?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product?.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // delete product
  const handleDeleteProduct = async (id) => {
    await dispatch(deleteProduct(id, page));

    setDeleteConfirm({
      open: false,
      id: null,
    });
  };

  return (
    <>
      <main className="flex-1 bg-[#F7FCFC] min-h-screen">
        <Header />

        <div className="p-4 md:p-6">
          {/* top */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                All Products
              </h1>

              <p className="text-slate-500 mt-2">
                Manage all medicines and pharmacy
                inventory
              </p>
            </div>

            <button
              onClick={() =>
                dispatch(
                  toggleCreateProductModal()
                )
              }
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* search */}
          <div className="mt-8 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* loading */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <LoaderCircle className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
          ) : filteredProducts?.length === 0 ? (
            // no products
            <div className="bg-white rounded-3xl border border-slate-200 p-14 mt-8 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Package2 className="w-10 h-10 text-emerald-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mt-6">
                No Products Found
              </h2>

              <p className="text-slate-500 mt-3">
                No medicines matched your
                search.
              </p>
            </div>
          ) : (
            <>
              {/* desktop table */}
              <div className="hidden xl:block overflow-x-auto mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <table className="w-full">
                  <thead className="bg-[#ecfdf5] border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-5 text-slate-700 font-semibold">
                        Product
                      </th>

                      <th className="text-left px-6 py-5 text-slate-700 font-semibold">
                        Category
                      </th>

                      <th className="text-left px-6 py-5 text-slate-700 font-semibold">
                        Price
                      </th>

                      <th className="text-left px-6 py-5 text-slate-700 font-semibold">
                        Stock
                      </th>

                      <th className="text-left px-6 py-5 text-slate-700 font-semibold">
                        Ratings
                      </th>

                      <th className="text-center px-6 py-5 text-slate-700 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts?.map(
                      (product, index) => (
                        <tr
                          key={product._id}
                          onClick={() => {
                            setSelectedProduct(
                              product
                            );

                            dispatch(
                              toggleViewProductModal()
                            );
                          }}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-slate-50/40"
                          }`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  product?.images?.[0]
                                    ?.url ||
                                  medicine
                                }
                                alt={
                                  product?.name
                                }
                                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                              />

                              <div>
                                <h3 className="font-bold text-slate-800">
                                  {
                                    product?.name
                                  }
                                </h3>

                                <p className="text-slate-500 text-sm mt-1 line-clamp-1 max-w-xs">
                                  {
                                    product?.description
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">
                              {
                                product?.category
                              }
                            </span>
                          </td>

                          <td className="px-6 py-5 font-bold text-slate-700">
                            Rs.{" "}
                            {product?.price}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                product?.stock >
                                5
                                  ? "bg-emerald-100 text-emerald-700"
                                  : product?.stock >
                                    0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product?.stock}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                              <span className="font-semibold text-slate-700">
                                {
                                  product?.ratings
                                }
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-3">
                              {/* view */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setSelectedProduct(
                                    product
                                  );

                                  dispatch(
                                    toggleViewProductModal()
                                  );
                                }}
                                className="w-10 h-10 rounded-xl bg-cyan-100 hover:bg-cyan-200 flex items-center justify-center transition-all"
                              >
                                <Eye className="w-5 h-5 text-cyan-700" />
                              </button>

                              {/* edit */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setSelectedProduct(
                                    product
                                  );

                                  dispatch(
                                    toggleUpdateProductModal()
                                  );
                                }}
                                className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 flex items-center justify-center transition-all"
                              >
                                <Pencil className="w-5 h-5 text-amber-700" />
                              </button>

                              {/* delete */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setDeleteConfirm(
                                    {
                                      open: true,
                                      id: product._id,
                                    }
                                  );
                                }}
                                className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all"
                              >
                                <Trash2 className="w-5 h-5 text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* mobile cards */}
              <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                {filteredProducts?.map(
                  (product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            product?.images?.[0]
                              ?.url ||
                            medicine
                          }
                          alt={product?.name}
                          className="w-24 h-24 rounded-2xl object-cover border border-slate-200"
                        />

                        <div className="flex-1">
                          <h2 className="font-bold text-slate-800">
                            {product?.name}
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">
                            {product?.category}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                            <span className="font-semibold text-slate-700">
                              {
                                product?.ratings
                              }
                            </span>
                          </div>

                          <h3 className="mt-3 font-bold text-emerald-700">
                            Rs.{" "}
                            {product?.price}
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-5">
                        <button
                          onClick={() => {
                            setSelectedProduct(
                              product
                            );

                            dispatch(
                              toggleViewProductModal()
                            );
                          }}
                          className="py-3 rounded-2xl bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-semibold transition-all"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProduct(
                              product
                            );

                            dispatch(
                              toggleUpdateProductModal()
                            );
                          }}
                          className="py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              id: product._id,
                            })
                          }
                          className="py-3 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* pagination */}
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((prev) => prev - 1)
                  }
                  className="w-12 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200">
                  {page} / {maxPage}
                </div>

                <button
                  disabled={page === maxPage}
                  onClick={() =>
                    setPage((prev) => prev + 1)
                  }
                  className="w-12 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* DELETE MODAL */}
        {deleteConfirm.open && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-center text-slate-800 mt-5">
                Delete Product?
              </h2>

              <p className="text-slate-500 text-center mt-3">
                This medicine will be permanently
                removed from PharmaAssist.
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
                  onClick={() =>
                    handleDeleteProduct(
                      deleteConfirm.id
                    )
                  }
                  className="py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODALS */}
        {isCreateProductModalOpened && (
          <CreateProductModal />
        )}

        {isUpdateProductModalOpened && (
          <UpdateProductModal
            selectedProduct={selectedProduct}
          />
        )}

        {isViewProductModalOpened && (
          <ViewProductModal
            selectedProduct={selectedProduct}
          />
        )}
      </main>
    </>
  );
};

export default Products;
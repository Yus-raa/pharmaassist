import React from "react";
import { useDispatch } from "react-redux";
import { X, Pill, Package, Star, Calendar, Tag } from "lucide-react";
import { toggleViewProductModal } from "../store/slices/extraSlice";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] border border-green-100">

        {/* Close */}
        <button
          onClick={() => dispatch(toggleViewProductModal())}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-100 transition"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <Pill className="w-6 h-6" />
            {selectedProduct.name}
          </h2>
          <p className="text-sm text-gray-500">
            Medicine detailed inspection panel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Images */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Product Images
            </h3>

            {selectedProduct.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {selectedProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img?.url}
                    alt="product"
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center border rounded-xl text-gray-400">
                No Images Available
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 text-sm">

            {/* ID */}
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-4 h-4" />
              <span className="font-semibold">ID:</span>
              <span className="break-all">{selectedProduct._id}</span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span className="font-semibold">Category:</span>
              <span>{selectedProduct.category}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-semibold">Price:</span>
              <span className="text-green-700 font-bold">
                Rs {selectedProduct.price?.toLocaleString()}
              </span>
            </div>

            {/* Stock */}
            <div>
              <span className="font-semibold text-gray-600">Stock:</span>{" "}
              {selectedProduct.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  In Stock ({selectedProduct.stock})
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">Ratings:</span>
              <span>{selectedProduct.ratings || "0"}</span>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">Created:</span>
              <span>
                {selectedProduct.createdAt
                  ? new Date(selectedProduct.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">
                Description
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {selectedProduct.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-6 text-xs text-gray-400 text-center">
          PharmaAssist Product Inspection Panel
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
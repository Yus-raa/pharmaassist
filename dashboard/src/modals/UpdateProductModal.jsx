import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircle, X, UploadCloud } from "lucide-react";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";
import { updateProduct } from "../store/slices/productsSlice";

const UpdateProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const categoryOptions = [
    "Pain Relief",
    "Cold & Flu",
    "Vitamins & Supplements",
    "Skincare",
    "Personal Care",
    "Medical Devices",
    "Diabetes Care",
    "Baby Care",
  ];

  // Fill form when product changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "",
        stock: selectedProduct.stock || "",
        images: [],
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    // only send images if admin selects new ones
    formData.images.forEach((img) => {
      data.append("images", img);
    });

    dispatch(updateProduct(selectedProduct._id, data));
  };

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 relative border border-green-100">

        {/* Close button */}
        <button
          onClick={() => dispatch(toggleUpdateProductModal())}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-100 transition"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">
            Update Medicine
          </h2>
          <p className="text-sm text-gray-500">
            Modify product details in PharmaAssist inventory
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Medicine Name"
            className="border rounded-xl p-3 focus:outline-green-400"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:outline-green-400"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (PKR)"
            className="border rounded-xl p-3 focus:outline-green-400"
          />

          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="border rounded-xl p-3 focus:outline-green-400"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Medicine description..."
            rows={4}
            className="border rounded-xl p-3 md:col-span-2 focus:outline-green-400"
          />

          {/* Image upload */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 border border-dashed border-green-300 p-4 rounded-xl cursor-pointer hover:bg-green-50">
              <UploadCloud className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Upload new images (optional)
              </span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Updating Product...
              </>
            ) : (
              "Update Medicine"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
import React, { useEffect, useState } from "react";

import {
  ImagePlus,
  LoaderCircle,
  PackagePlus,
  Pill,
  Upload,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  createProduct,
  clearProductMessage,
  clearProductError,
} from "../store/slices/productsSlice";

import { toggleCreateProductModal } from "../store/slices/extraSlice";

const CreateProductModal = () => {
  const dispatch = useDispatch();

  const { loading, message, error } = useSelector(
    (state) => state.product
  );

  const [previewImages, setPreviewImages] =
    useState([]);

  const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  category: "Pain Relief",
  stock: "",
  symptoms: "",
  useCases: "",
  images: [],
});

  // ======================================================
  // CATEGORY OPTIONS
  // ======================================================

  const categoryOptions = [
    "Pain Relief",
    "Cold & Flu",
    "Vitamins & Supplements",
    "Skincare",
    "Personal Care",
    "Medical Equipment",
    "Baby Care",
    "Diabetes Care",
    "Heart Health",
    "Digestive Care",
    "Prescription Medicines",
    "Healthcare Essentials",
  ];

  // ======================================================
  // HANDLE INPUTS
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // HANDLE IMAGES
  // ======================================================

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData({
      ...formData,
      images: files,
    });

    // preview urls
    const imagePreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(imagePreviews);
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);

    data.append(
      "description",
      formData.description
    );

    data.append("symptoms", formData.symptoms);
data.append("useCases", formData.useCases);

    data.append("price", formData.price);

    data.append(
      "category",
      formData.category
    );

    data.append("stock", formData.stock);

    formData.images.forEach((image) => {
      data.append("images", image);
    });

    dispatch(createProduct(data));
  };

  // ======================================================
  // CLOSE MODAL AFTER SUCCESS
  // ======================================================

  useEffect(() => {
    if (message) {
      dispatch(toggleCreateProductModal());

      dispatch(clearProductMessage());

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Pain Relief",
        stock: "",
        images: [],
      });

      setPreviewImages([]);
    }

    if (error) {
      dispatch(clearProductError());
    }
  }, [message, error, dispatch]);

return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      {/* MODAL CONTAINER */}
      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">

        {/* HEADER (fixed, not scrollable) */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 sm:px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <PackagePlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">
                Add New Medicine
              </h2>
              <p className="text-xs sm:text-sm text-emerald-50">
                PharmaAssist inventory management
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(toggleCreateProductModal())}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 hover:bg-red-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* NAME */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Medicine Name
                </label>
                <div className="relative mt-1">
                  <Pill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Panadol Extra"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-emerald-400 outline-none"
                  />
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-cyan-400 outline-none"
                >
                  {categoryOptions.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-emerald-400 outline-none resize-none"
              />
            </div>

            {/* SYMPTOMS */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Symptoms
              </label>
              <input
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="fever, headache"
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>

            {/* USE CASES */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Use Cases
              </label>
              <input
                name="useCases"
                value={formData.useCases}
                onChange={handleChange}
                placeholder="pain relief, flu treatment"
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Images
              </label>

              <label className="mt-2 border-2 border-dashed border-emerald-200 rounded-2xl p-6 flex flex-col items-center cursor-pointer bg-emerald-50/40">
                <Upload className="w-8 h-8 text-emerald-600" />
                <p className="text-sm text-slate-600 mt-2">
                  Click to upload images
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </label>

              {/* PREVIEW */}
              {previewImages?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {previewImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="h-28 w-full object-cover rounded-xl border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => dispatch(toggleCreateProductModal())}
                className="flex-1 py-3 rounded-2xl border bg-white hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin w-5 h-5" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PackagePlus className="w-5 h-5" />
                    Create Product
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;